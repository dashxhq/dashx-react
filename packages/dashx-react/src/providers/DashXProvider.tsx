import DashX from '@dashx/browser';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Client, ClientParams, WebSocketManager, WebsocketMessageType } from '@dashx/browser';

const DashXContext = createContext<Client | null>(null);

type WebSocketContextType = {
  isConnected: boolean;
  subscribe: (callback: (message: WebsocketMessageType) => void) => () => void;
  wsManagerRef: React.RefObject<WebSocketManager>;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

function DashXProvider({
  children,
  publicKey,
  baseUri,
  realtimeBaseUri,
  targetEnvironment,
  targetProduct,
  targetVersion,
}: React.PropsWithChildren<ClientParams>) {
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

  const subscribe = (callback: (message: WebsocketMessageType) => void) => {
    subscribersRef.current.add(callback);

    // Return unsubscribe function
    return () => {
      subscribersRef.current.delete(callback);
    };
  };

  useEffect(() => {
    if (!dashX) return;

    // Create WebSocket connection
    const wsManager = dashX.createWebSocketConnection({
      queryParams: {
        publicKey: dashX.publicKey,
        ...(dashX.targetEnvironment && { targetEnvironment: dashX.targetEnvironment }),
      },
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

    // Cleanup function
    return () => {
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect();
        wsManagerRef.current = null;
      }
      setIsConnected(false);
    };
  }, [dashX]);

  return (
    <DashXContext.Provider value={dashX}>
      <WebSocketContext.Provider value={{ isConnected, subscribe, wsManagerRef }}>
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
