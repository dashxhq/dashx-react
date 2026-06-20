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
  webSocketQueryParams?: Record<string, any>,
  /**
   * The visitor's account uid, addressed on both transports (GraphQL + WS).
   * Pass `null` to explicitly clear it (e.g. on logout); omit (`undefined`) to
   * leave it unchanged. Pair with `identityToken` for the same identity.
   */
  identityUid?: string | null,
  /**
   * Identity token (minted with your DashX server SDK's `generateIdentityToken`,
   * or from an exchange endpoint you control). When set, the SDK uses it for both
   * GraphQL (`X-Identity-Token` header) and the WebSocket handshake — the server
   * identifies the visitor from it, which is the ownership key for InApp Chat.
   * Pass `null` to clear it on logout; omit (`undefined`) to leave it unchanged.
   */
  identityToken?: string | null,
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
  identityUid,
  identityToken,
}: React.PropsWithChildren<DashXProviderProps>) {
  const dashX = React.useMemo(
    () => {
      const client = DashX.configure({
        publicKey: publicKey,
        baseUri: baseUri,
        realtimeBaseUri: realtimeBaseUri,
        targetEnvironment: targetEnvironment,
        targetProduct,
        targetVersion,
      });
      // Apply identity synchronously at creation so a child that starts work in
      // its own mount effect (child effects run before this provider's effects)
      // sees the token already set. Later prop changes go through the effect
      // below; identity is intentionally not a useMemo dep (we don't recreate
      // the client when it changes).
      if (identityUid !== undefined || identityToken !== undefined) {
        client.setIdentity(identityUid, identityToken);
      }
      return client;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [publicKey, baseUri, realtimeBaseUri, targetEnvironment, targetProduct, targetVersion],
  );

  // `webSocketQueryParams` defaults to a fresh `{}` each render and is a dep of
  // the effects below, so memoize on its content to keep the reference stable —
  // otherwise those effects (setIdentity / WS init) re-run on every render.
  const webSocketQueryParamsKey = JSON.stringify(webSocketQueryParams ?? {});
  const stableWebSocketQueryParams = React.useMemo(
    () => webSocketQueryParams ?? {},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [webSocketQueryParamsKey],
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

  // Forward `identityUid` + `identityToken` into the dashX client so the same
  // identity is used by GraphQL and the WS. Pass the props as-is: `setIdentity`
  // treats `undefined` as "leave unchanged", so setting only `identityToken`
  // won't clobber an existing account uid (and vice versa).
  const previousIdentityTokenRef = useRef(identityToken);
  useEffect(() => {
    if (!dashX || (identityUid === undefined && identityToken === undefined)) {
      return;
    }

    dashX.setIdentity(identityUid, identityToken);

    // This provider owns the socket (created via `createWebSocketConnection`,
    // not the client's internal manager that `setIdentity` reconnects), so on a
    // token change we recreate it here to put the new identity_token in the WS
    // URL. GraphQL picks up the new header on its own; tracked chat channels
    // re-subscribe on the new socket's `onOpen`.
    const tokenChanged = identityToken !== previousIdentityTokenRef.current;
    previousIdentityTokenRef.current = identityToken;
    if (tokenChanged && wsManagerRef.current) {
      wsManagerRef.current.disconnect();
      wsManagerRef.current = null;
      initializeWebSocket(stableWebSocketQueryParams);
    }
  }, [ dashX, identityUid, identityToken, initializeWebSocket, stableWebSocketQueryParams ]);

  useEffect(() => {
    if (initializeWebSocketOnLoad) {
      initializeWebSocket(stableWebSocketQueryParams);
    }
  }, [ initializeWebSocketOnLoad, initializeWebSocket, stableWebSocketQueryParams ]);

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
