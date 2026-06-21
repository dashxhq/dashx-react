import uuid from 'uuid-random';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { InAppChatMessageData } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';
import { useWebSocket } from '../providers/DashXProvider.js';

type UseInAppChatHookProps = {
  // The workspace's chat-identity id (the receiving surface), created when the
  // chat integration is installed; pasted into config alongside the public key.
  identityId: string;
  // Caller-supplied conversation key; the server uses it so repeat opens with
  // the same key resolve to the same conversation thread.
  idempotencyKey: string;
  // Optional automated first message sent when the conversation is first
  // created (e.g. "Help with order #123"). Sent via `startInAppChatConversation`
  // with a stable client message id, so it lands exactly once across reopens.
  initialMessage?: string;
};

// UI-level message. `aiRole` distinguishes the visitor from agent/AI replies and
// drives alignment; it arrives lowercase ('user'/'assistant'), so the widget
// compares it case-insensitively (see `isOutgoing`).
type InAppChatMessage = {
  id: string;
  externalUid: string | null;
  renderedContent: any;
  aiRole: string | null;
  createdAt: string;
  turnSeq?: number;
  isPending?: boolean;
};

type UseInAppChatHookResponse = {
  conversationId: string | null;
  messages: InAppChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  // Returns `true` if the message was optimistically queued, `false` if the chat
  // wasn't ready (no conversation yet). Synchronous so the caller can clear the
  // composer immediately on `true`; callers keep the input populated on `false`.
  sendMessage: (text: string) => boolean;
};

const CHAT_CHANNEL_PREFIX = 'in_app_chat:conversation:';

const toUiMessage = (message: InAppChatMessageData): InAppChatMessage => ({
  id: message.id,
  // `externalUid` / `aiRole` are nullable in the schema, so the SDK types them as
  // optional; normalize the absent case to null for the UI message shape.
  externalUid: message.externalUid ?? null,
  renderedContent: message.renderedContent,
  aiRole: message.aiRole ?? null,
  createdAt: message.createdAt,
  turnSeq: message.turnSeq,
});

// Dedup by externalUid (server message replaces the optimistic pending one)
// then id; order by createdAt as the authoritative key. `turnSeq` isn't in the
// fetched message fields, so it's absent from history (which already arrives
// ordered, preserved by the stable sort); it only breaks same-createdAt ties
// among realtime WS events, which carry it.
const mergeMessages = (
  existing: InAppChatMessage[],
  incoming: InAppChatMessage[],
): InAppChatMessage[] => {
  const byKey = new Map<string, InAppChatMessage>();
  const keyOf = (message: InAppChatMessage) => message.externalUid || message.id;

  [...existing, ...incoming].forEach((message) => {
    const existingForKey = byKey.get(keyOf(message));
    if (!existingForKey || existingForKey.isPending) {
      byKey.set(keyOf(message), message);
    }
  });

  return [...byKey.values()].sort((a, b) => {
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
    return (a.turnSeq ?? 0) - (b.turnSeq ?? 0);
  });
};

/**
 * Two-way InApp Chat for a visitor.
 *
 * PREREQUISITE: the surrounding `<DashXProvider>` must already have a valid
 * `identityToken` (and matching `identityUid`). The chat mutations require
 * identity-token auth — if the chat starts before an identity is resolved, they
 * are rejected and the hook surfaces an auth error. It does NOT auto-retry when
 * a token arrives later (its inputs are `identityId`/`idempotencyKey`, not the
 * visitor token), so only render the chat once `identityToken` is available —
 * e.g. `{identityToken && <InAppChat … />}`. `<InAppChatButton>` largely sidesteps
 * this by starting lazily when the visitor opens it, by which point the provider
 * has applied the token.
 */
const useInAppChat = ({ identityId, idempotencyKey, initialMessage }: UseInAppChatHookProps): UseInAppChatHookResponse => {
  const dashX = useDashXProvider();
  const { isConnected, initializeWebSocket } = useWebSocket();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<InAppChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bumped on every identity/key change and on unmount so stale start/fetch/send
  // resolutions are ignored (the classic React async race).
  const generationRef = useRef(0);
  const conversationIdRef = useRef<string | null>(null);

  const appendMessages = useCallback((incoming: InAppChatMessage[]) => {
    setMessages((prev) => mergeMessages(prev, incoming));
  }, []);

  useEffect(() => {
    const generation = (generationRef.current += 1);
    const isStale = () => generation !== generationRef.current;

    setConversationId(null);
    setMessages([]);
    setIsLoading(true);
    setError(null);
    conversationIdRef.current = null;

    // Ensure the WS exists (idempotent — returns early if already created).
    initializeWebSocket();

    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const conversation = await dashX.startInAppChatConversation({
          identityId,
          clientIdempotencyKey: idempotencyKey,
          // Stable client message id → the automated message is inserted once,
          // even if the conversation is reopened (the server dedups repeat sends).
          // `-` separator (client ids allow only `[A-Za-z0-9._-]`); the key is
          // truncated so the suffixed id stays within the 1-128 char limit.
          ...(initialMessage
            ? { content: { text: initialMessage }, clientMessageId: `${idempotencyKey.slice(0, 122)}-intro` }
            : {}),
        });
        if (isStale()) return;

        const convId = conversation.id;
        setConversationId(convId);
        conversationIdRef.current = convId;

        const refetchHistory = async () => {
          const history = await dashX.fetchInAppChatMessages({ conversationId: convId });
          if (isStale()) return;
          appendMessages(history.map(toUiMessage));
        };

        // Subscribe BEFORE fetching history so a reply landing in the gap is
        // buffered, not dropped. `onReconnectAck` fires on reconnect re-acks and
        // on a first ack that arrives after a `ready` timeout — both mean we are
        // (now) subscribed, so clear any connection error and (re)load history.
        const subscription = dashX.subscribeToChannel(
          `${CHAT_CHANNEL_PREFIX}${convId}`,
          (event) => {
            if (!isStale()) appendMessages([toUiMessage(event)]);
          },
          {
            onReconnectAck: () => {
              if (isStale()) return;
              setError(null);
              refetchHistory().catch(() => {});
            },
          },
        );
        unsubscribe = subscription.unsubscribe;

        // Load history only once the subscription is acked — fetching before
        // that would show history while silently never receiving realtime
        // replies. On ack failure, surface an error and defer the fetch to
        // `onReconnectAck` (fires if/when the channel finally acks).
        try {
          await subscription.ready;
        } catch {
          if (!isStale()) setError('Couldn’t connect to live chat. Retrying…');
          return;
        }
        if (isStale()) return;
        await refetchHistory();
      } catch {
        if (!isStale()) setError('Failed to start chat');
      } finally {
        if (!isStale()) setIsLoading(false);
      }
    })();

    return () => {
      // Invalidate in-flight async and drop the old channel before the next
      // conversation binds.
      generationRef.current += 1;
      unsubscribe?.();
    };
  }, [dashX, identityId, idempotencyKey, initialMessage, initializeWebSocket, appendMessages]);

  // Synchronous on purpose: it returns `true` the moment the message is optimistically
  // queued and runs the network send in the background. The caller clears the composer
  // on `true` immediately — if it instead awaited the round-trip, a fast second Enter
  // would re-send the still-present text as a new message (fresh clientMessageId, so the
  // backend won't dedupe it) and create a duplicate.
  const sendMessage = useCallback(
    (text: string): boolean => {
      const convId = conversationIdRef.current;
      // Not ready (conversation still starting, or start failed) — report back so
      // the caller can keep the typed text instead of clearing it on a no-op send.
      if (!text.trim() || !convId) return false;

      // Pin the generation so a response that resolves after the identity/key
      // changed (or unmount) can't contaminate the new conversation's state.
      const generation = generationRef.current;
      const clientMessageId = uuid();
      const optimistic: InAppChatMessage = {
        id: clientMessageId,
        externalUid: `in_app_chat:${clientMessageId}`,
        renderedContent: { text },
        aiRole: 'USER',
        createdAt: new Date().toISOString(),
        isPending: true,
      };
      appendMessages([optimistic]);

      void (async () => {
        try {
          const serverMessage = await dashX.sendInAppChatMessage({
            conversationId: convId,
            identityId,
            content: { text },
            clientMessageId,
          });
          if (generation !== generationRef.current) return;
          // Reconcile by externalUid (the WS echo reconciles too — both idempotent).
          appendMessages([toUiMessage(serverMessage)]);
        } catch {
          if (generation === generationRef.current) setError('Failed to send message');
        }
      })();

      // Queued (optimistically appended) — the background send reconciles/errors later.
      return true;
    },
    [dashX, identityId, appendMessages],
  );

  return { conversationId, messages, isLoading, isConnected, error, sendMessage };
};

export type { UseInAppChatHookProps, UseInAppChatHookResponse, InAppChatMessage };

export default useInAppChat;
