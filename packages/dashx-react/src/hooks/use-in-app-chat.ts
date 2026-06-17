import uuid from 'uuid-random';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { InAppChatMessageData } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';
import { useWebSocket } from '../providers/DashXProvider.js';

type UseInAppChatHookProps = {
  // The workspace's DASHX chat-identity id (the receiving surface). Created on
  // installation; pasted-in config alongside the public key.
  identityId: string;
  // SDK-supplied conversation key; composed server-side into the conversation's
  // idempotency key so repeat opens resolve to the same thread.
  idempotencyKey: string;
  // Optional automated first message sent when the conversation is first
  // created (e.g. "Help with order #123"). Sent via `startInAppChatConversation`
  // with a stable client message id, so it lands exactly once across reopens.
  initialMessage?: string;
};

// UI-level message. `aiRole` is 'USER' for the visitor's own messages and
// 'ASSISTANT' for agent/AI replies (drives alignment).
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
  sendMessage: (text: string) => Promise<void>;
};

const CHAT_CHANNEL_PREFIX = 'in_app_chat:conversation:';

const toUiMessage = (message: InAppChatMessageData): InAppChatMessage => ({
  id: message.id,
  externalUid: message.externalUid,
  renderedContent: message.renderedContent,
  aiRole: message.aiRole,
  createdAt: message.createdAt,
  turnSeq: message.turnSeq,
});

// Dedup by externalUid (server message replaces the optimistic pending one)
// then id; order by createdAt as the authoritative key. `turnSeq` is
// GraphQL-hidden so it's absent from fetched history (the backend already
// returns history in turn_seq order, preserved by the stable sort); it only
// breaks same-createdAt ties among realtime WS events, which carry it.
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
          // even if the conversation is reopened (server dedups by external_uid).
          // Separator must be `-` (not `:`) — client ids are restricted to
          // `[A-Za-z0-9._-]` by the backend's validate_client_short_id.
          ...(initialMessage
            ? { content: { text: initialMessage }, clientMessageId: `${idempotencyKey}-intro` }
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

  const sendMessage = useCallback(
    async (text: string) => {
      const convId = conversationIdRef.current;
      if (!text.trim() || !convId) return;

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
    },
    [dashX, identityId, appendMessages],
  );

  return { conversationId, messages, isLoading, isConnected, error, sendMessage };
};

export type { UseInAppChatHookProps, UseInAppChatHookResponse, InAppChatMessage };

export default useInAppChat;
