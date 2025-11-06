import DashX from '@dashx/browser';
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { Client, ClientParams, WebSocketManager, WebsocketMessageType } from '@dashx/browser';

const DashXContext = createContext<Client | null>(null);

type WebSocketContextType = {
  isConnected: boolean;
  subscribe: (callback: (message: WebsocketMessageType) => void) => () => void;
  wsManagerRef: React.RefObject<WebSocketManager>;
  initializeWebSocket: (queryParams?: Record<string, any>) => void;
  disconnectWebSocket: () => void;
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
      DashX({
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

  const disconnectWebSocket = useCallback(() => {
    if (wsManagerRef.current) {
      console.log('Disconnecting WebSocket');
      wsManagerRef.current.disconnect();
      wsManagerRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const initializeWebSocket = useCallback((customQueryParams?: Record<string, any>) => {
    if (!dashX) {
      console.error('DashX client not initialized');
      return;
    }

    // Disconnect any existing connection first
    if (wsManagerRef.current) {
      console.log('Disconnecting existing WebSocket before reinitializing');
      wsManagerRef.current.disconnect();
      wsManagerRef.current = null;
      setIsConnected(false);
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

  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [ disconnectWebSocket ]);

  return (
    <DashXContext.Provider value={dashX}>
      <WebSocketContext.Provider
        value={{
          isConnected,
          subscribe,
          wsManagerRef,
          initializeWebSocket,
          disconnectWebSocket
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
