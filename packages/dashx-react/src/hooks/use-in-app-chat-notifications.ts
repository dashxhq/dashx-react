import { useCallback, useRef } from 'react';
import type { InAppChatMessageData } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';

type InAppChatNotificationOptions = {
  // Notification title. Defaults to 'New message'.
  title?: string;
  // Icon URL shown in the notification.
  icon?: string;
  // Custom body text from the inbound message; defaults to the message text.
  renderBody?: (message: InAppChatMessageData) => string;
  // When to request notification permission. 'firstOpen' (the default for the
  // launcher) requests it the first time the visitor opens chat — a real user
  // gesture, which browsers require for a non-penalized prompt. 'manual' never
  // auto-requests (use for always-visible surfaces, where the embedder drives
  // the prompt via the returned `requestPermission`).
  requestPermissionOn?: 'firstOpen' | 'manual';
};

type UseInAppChatNotificationsProps = {
  // Whether the chat surface is currently open/visible. Combined with tab
  // visibility + window focus to decide if the visitor is actively looking at
  // chat (in which case we don't notify).
  isOpen: boolean;
  // `false` disables notifications entirely.
  enabled?: boolean;
  options?: InAppChatNotificationOptions;
  // Invoked when the visitor clicks a notification — focus is handled by the
  // SDK; this opens the chat panel.
  onActivate?: () => void;
};

const textFromContent = (content: any): string => {
  if (typeof content === 'string') return content;
  return content?.text ?? content?.body ?? '';
};

/**
 * Foreground browser notifications for incoming In-App Chat messages. Returns a
 * `handleInboundMessage` to pass as `useInAppChat`'s `onInboundMessage`; it
 * fires a notification only for agent/AI replies that arrive while the chat
 * isn't focused (panel closed, or tab hidden/unfocused) and only once the
 * visitor has granted permission.
 */
const useInAppChatNotifications = ({
  isOpen,
  enabled = true,
  options,
  onActivate,
}: UseInAppChatNotificationsProps) => {
  const dashX = useDashXProvider();

  // Latest values for the message handler, so it stays referentially stable
  // (it's wired into the chat hook's subscription).
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const onActivateRef = useRef(onActivate);
  onActivateRef.current = onActivate;

  const isChatFocused = (): boolean => {
    if (!isOpenRef.current) return false;
    if (typeof document === 'undefined') return false;
    if (document.hidden) return false;
    if (typeof document.hasFocus === 'function' && !document.hasFocus()) return false;
    return true;
  };

  const handleInboundMessage = useCallback(
    (message: InAppChatMessageData) => {
      if (!enabledRef.current) return;
      // Agent/AI replies only — never the visitor's own echoed message.
      if ((message.aiRole ?? '').toUpperCase() === 'USER') return;
      // Don't interrupt a visitor who's actively looking at the chat.
      if (isChatFocused()) return;

      const body = optionsRef.current?.renderBody?.(message) ?? textFromContent(message.renderedContent);
      if (!body) return;

      dashX.showInAppChatNotification?.({
        title: optionsRef.current?.title ?? 'New message',
        body,
        icon: optionsRef.current?.icon,
        tag: message.conversationId ? `in_app_chat:${message.conversationId}` : undefined,
        onClick: () => onActivateRef.current?.(),
      });
    },
    [dashX],
  );

  const requestPermission = useCallback(
    () => dashX.requestNotificationPermission?.() ?? Promise.resolve('denied' as const),
    [dashX],
  );

  // Call this SYNCHRONOUSLY from the surface's open event (a real user gesture)
  // so the permission prompt lands inside the browser's transient activation
  // window. Requesting from an effect after the click has unwound is
  // ignored/rejected by some browsers. Honors `requestPermissionOn` ('manual'
  // skips it), and is safe to call on every open (no-ops once permission is
  // decided — see Client.requestNotificationPermission).
  const requestPermissionOnOpen = useCallback(() => {
    if (!enabledRef.current) return;
    if ((optionsRef.current?.requestPermissionOn ?? 'firstOpen') !== 'firstOpen') return;
    dashX.requestNotificationPermission?.().catch(() => {});
  }, [dashX]);

  return { handleInboundMessage, requestPermission, requestPermissionOnOpen };
};

export type { InAppChatNotificationOptions, UseInAppChatNotificationsProps };

export default useInAppChatNotifications;
