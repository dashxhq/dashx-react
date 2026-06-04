import DashX from '@dashx/browser';
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { Client, ClientParams, WebSocketManager, WebsocketMessageType } from '@dashx/browser';

const DashXContext = createContext<Client | null>(null);

type WebSocketContextType = {
  isConnected: boolean;
  subscribe: (callback: (message: WebsocketMessageType) => void) => () => void;
  wsManagerRef: React.RefObject<WebSocketManager>;
  initializeWebSocket: (queryParams?: Record<string, any>) => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

type DashXProviderProps = ClientParams & {
  initializeWebSocketOnLoad?: boolean,
  webSocketQueryParams?: Record<string, any>
}

function DashXProvider({
  children,
  publicKey,
  baseUri,
  realtimeBaseUri,
  targetEnvironment,
  targetProduct,
  targetVersion,
  initializeWebSocketOnLoad = false,
  webSocketQueryParams = {},
}: React.PropsWithChildren<DashXProviderProps>) {
  const dashX = React.useMemo(
    () =>
      DashX.configure({
        publicKey: publicKey,
        baseUri: baseUri,
        realtimeBaseUri: realtimeBaseUri,
        targetEnvironment: targetEnvironment,
        targetProduct,
        targetVersion,
      }),
    [publicKey, baseUri, realtimeBaseUri, targetEnvironment, targetProduct, targetVersion],
  );

  // WebSocket state
  const [isConnected, setIsConnected] = useState(false);
  const wsManagerRef = useRef<WebSocketManager | null>(null);
  const subscribersRef = useRef<Set<(message: WebsocketMessageType) => void>>(new Set());

  const subscribe = useCallback((callback: (message: WebsocketMessageType) => void) => {
    subscribersRef.current.add(callback);

    // Return unsubscribe function
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  const initializeWebSocket = useCallback((customQueryParams?: Record<string, any>) => {
    if (!dashX) {
      console.error('DashX client not initialized');
      return;
    }

    // Reuse an existing manager — it owns its own throttled reconnect
    // lifecycle. Tearing it down and creating a new one on every call (e.g.
    // when a consumer re-invokes this as `isConnected` flips to false on each
    // close) resets the per-instance reconnect throttle and reconnects
    // immediately, defeating the backoff. Create one only if none exists.
    if (wsManagerRef.current) {
      return;
    }

    const queryParams = {
      publicKey: dashX.publicKey,
      ...(dashX.targetEnvironment && { targetEnvironment: dashX.targetEnvironment }),
      ...customQueryParams,
    };

    const wsManager = dashX.createWebSocketConnection({
      queryParams,
      onError: (errorEvent: Event) => console.error({ errorEvent }),
      onClose: (closeEvent: CloseEvent) => {
        console.log({ closeEvent });
        setIsConnected(false);
      },
      onMessage: (message: WebsocketMessageType) => {
        // Notify all subscribers
        subscribersRef.current.forEach((callback) => {
          try {
            callback(message);
          } catch (error) {
            console.error('Error in WebSocket subscriber callback:', error);
          }
        });
      },
      onOpen: () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
      },
      onReconnect: (attempt: number) => {
        console.log(`WebSocket reconnecting... attempt ${attempt}`);
      },
      onReconnectFailed: () => {
        console.error('WebSocket reconnection failed');
        setIsConnected(false);
      },
    });

    wsManagerRef.current = wsManager;
    wsManager.connect();
  }, [dashX]);

  useEffect(() => {
    if (initializeWebSocketOnLoad) {
      initializeWebSocket(webSocketQueryParams);
    }
  }, [ initializeWebSocketOnLoad, webSocketQueryParams ]);

  return (
    <DashXContext.Provider value={dashX}>
      <WebSocketContext.Provider
        value={{
          isConnected,
          subscribe,
          wsManagerRef,
          initializeWebSocket
        }}
      >
        {children}
      </WebSocketContext.Provider>
    </DashXContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a DashXProvider');
  }
  return context;
}

export default DashXProvider;
export { DashXContext };
