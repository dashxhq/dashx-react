import DashX from '@dashx/browser';
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { BeforeSend, CapturedEvent, Client, ClientParams, WebSocketManager, WebsocketMessageType } from '@dashx/browser';

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
  /**
   * Fetches an identity token from your backend, e.g. a member token that keeps a workspace member
   * online. The client calls it before the socket connects, before each token expires and once after
   * the server refuses one, and reconnects the socket each time. Read through a ref, so an inline
   * function does not recreate the client.
   */
  identityTokenProvider?: () => Promise<string>,
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
  autocapture,
  maskPersonalDataProperties,
  customPersonalDataProperties,
  beforeSend,
  identityTokenProvider,
}: React.PropsWithChildren<DashXProviderProps>) {
  // Read through a ref so an inline `beforeSend` takes effect without recreating the client on
  // every render.
  const beforeSendRef = useRef(beforeSend);
  beforeSendRef.current = beforeSend;
  const stableBeforeSend = useCallback<BeforeSend>((event) => {
    let result: CapturedEvent | null = event;
    for (const fn of [ beforeSendRef.current ?? [] ].flat()) {
      if (!result) break;
      result = fn(result);
    }
    return result;
  }, []);

  const identityTokenProviderRef = useRef(identityTokenProvider);
  identityTokenProviderRef.current = identityTokenProvider;
  const hasIdentityTokenProvider = Boolean(identityTokenProvider);
  const stableIdentityTokenProvider = useCallback(() => {
    const provider = identityTokenProviderRef.current;
    return provider ? provider() : Promise.reject(new Error('identityTokenProvider was removed'));
  }, []);

  const customPersonalDataPropertiesKey = JSON.stringify(customPersonalDataProperties ?? []);

  const dashX = React.useMemo(
    () => {
      const client = DashX.configure({
        publicKey: publicKey,
        baseUri: baseUri,
        realtimeBaseUri: realtimeBaseUri,
        targetEnvironment: targetEnvironment,
        targetProduct,
        targetVersion,
        maskPersonalDataProperties,
        customPersonalDataProperties,
        beforeSend: stableBeforeSend,
        identityTokenProvider: hasIdentityTokenProvider ? stableIdentityTokenProvider : undefined,
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
    [
      publicKey,
      baseUri,
      realtimeBaseUri,
      targetEnvironment,
      targetProduct,
      targetVersion,
      maskPersonalDataProperties,
      customPersonalDataPropertiesKey,
      hasIdentityTokenProvider,
    ],
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
  // The client replaces its manager on every reconnect for a new identity token, so read it fresh.
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

    // Reuse the client's socket - it owns its own throttled reconnect lifecycle, and reconnects
    // itself for a new identity token. Creating one per call (e.g. when a consumer re-invokes this
    // as `isConnected` flips to false on each close) would reset that throttle and defeat the backoff.
    if (dashX.webSocketManager) {
      return;
    }

    // The client adds `publicKey` and `targetEnvironment` itself. Provider-level params apply to
    // every provider-owned socket, including when a hook opens it first with no args.
    const queryParams = {
      ...stableWebSocketQueryParams,
      ...customQueryParams,
    };

    const syncManager = () => {
      wsManagerRef.current = dashX.webSocketManager;
    };

    dashX.connectWebSocket({
      queryParams,
      onError: (errorEvent: Event) => console.error({ errorEvent }),
      onClose: (closeEvent: CloseEvent) => {
        console.log({ closeEvent });
        syncManager();
        setIsConnected(false);
      },
      onMessage: (message: WebsocketMessageType) => {
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
        syncManager();
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
    syncManager();
  }, [dashX, stableWebSocketQueryParams]);

  // Forward `identityUid` + `identityToken` into the dashX client so the same
  // identity is used by GraphQL and the WS. Pass the props as-is: `setIdentity`
  // treats `undefined` as "leave unchanged", so setting only `identityToken`
  // won't clobber an existing account uid (and vice versa). A new token
  // reconnects the client's socket with it.
  useEffect(() => {
    if (!dashX || (identityUid === undefined && identityToken === undefined)) {
      return;
    }

    dashX.setIdentity(identityUid, identityToken);
  }, [ dashX, identityUid, identityToken ]);

  // A replaced client (new keys or environment) must not leave its socket running.
  useEffect(() => () => {
    dashX?.disconnectWebSocket();
    wsManagerRef.current = null;
    setIsConnected(false);
  }, [ dashX ]);

  // Started here rather than passed to `configure`: StrictMode runs the client `useMemo` twice and
  // keeps one, which would leave the discarded client's listeners capturing every page view.
  const autocaptureKey = JSON.stringify(autocapture ?? false);
  useEffect(() => {
    if (!dashX || !autocapture) {
      return;
    }

    dashX.startAutocapture(autocapture === true ? {} : autocapture);
    return () => dashX.stopAutocapture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dashX, autocaptureKey ]);

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
