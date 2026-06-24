import React, { useCallback, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';

import { Button, Flex, Popover, Theme, type ThemeProps } from '../components';
import { InAppChat, type InAppChatWrapperProps } from './InAppChat.js';
import useInAppChat from '../hooks/use-in-app-chat.js';
import useInAppChatNotifications from '../hooks/use-in-app-chat-notifications.js';

type LauncherPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

type InAppChatButtonProps = InAppChatWrapperProps & {
  /** Where the floating launcher sits on screen. Defaults to `bottom-right`. */
  position?: LauncherPosition,
  /** Theme overrides for the launcher + chat surface (accent color, mode, roundness, …). */
  theme?: ThemeProps,
};

// Full, non-interpolated class strings so Tailwind can detect them.
const POSITION_CLASS: Record<LauncherPosition, string> = {
  'bottom-right': 'right-4 bottom-4',
  'bottom-left': 'left-4 bottom-4',
  'top-right': 'right-4 top-4',
  'top-left': 'left-4 top-4',
};

const InAppChatButton = ({
  identityId,
  idempotencyKey,
  initialMessage,
  notifications = true,
  position = 'bottom-right',
  theme,
  ...props
}: InAppChatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Latch: once the launcher has been opened, keep the chat hook active so its
  // channel subscription persists while the panel is closed — that's what lets
  // us notify on replies that land while the panel is shut. Before the first
  // open the hook is idle, so no conversation is created on page load.
  const hasOpenedRef = useRef(false);
  if (isOpen) hasOpenedRef.current = true;
  const enabled = hasOpenedRef.current;

  const open = useCallback(() => setIsOpen(true), []);

  const { handleInboundMessage, requestPermissionOnOpen } = useInAppChatNotifications({
    isOpen,
    enabled: notifications !== false,
    options: typeof notifications === 'object' ? notifications : undefined,
    onActivate: open,
  });

  // Request notification permission inside the open gesture (synchronously), so
  // the prompt runs within the browser's transient user activation — requesting
  // from an effect after the click unwinds is ignored on some browsers.
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) requestPermissionOnOpen();
      setIsOpen(nextOpen);
    },
    [requestPermissionOnOpen],
  );

  const chat = useInAppChat({
    identityId,
    idempotencyKey,
    initialMessage,
    enabled,
    onInboundMessage: handleInboundMessage,
  });

  return (
    <Theme {...theme}>
      <Flex className={`fixed z-50 ${POSITION_CLASS[position]}`}>
        <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
          <Popover.Trigger>
            <Button shape="square" roundness="full" variant="fill" size="large">
              <MessageCircle />
            </Button>
          </Popover.Trigger>
          {/* The chat hook lives at the launcher level (above the popover) so its
              subscription survives the panel closing — required to notify on
              replies that arrive while the panel is shut. It activates lazily on
              first open, so no empty conversation is created on page load. */}
          <Popover.Content spacing="large" width="350px" height="450px">
            <InAppChat
              {...chat}
              borderless
              withChatHeader
              withPopoverClose
              {...props}
            />
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </Theme>
  );
};

export type { InAppChatButtonProps };

export default InAppChatButton;
