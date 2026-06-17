import React from 'react';
import { MessageCircle } from 'lucide-react';

import { Button, Flex, Popover, Theme, type ThemeProps } from '../components';
import InAppChat, { type InAppChatWrapperProps } from './InAppChat.js';

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
  position = 'bottom-right',
  theme,
  ...props
}: InAppChatButtonProps) => (
  <Theme {...theme}>
    <Flex className={`fixed z-50 ${POSITION_CLASS[position]}`}>
      <Popover.Root>
        <Popover.Trigger>
          <Button shape="square" roundness="full" variant="fill" size="large">
            <MessageCircle />
          </Button>
        </Popover.Trigger>
        {/* Radix unmounts Content while closed, so the chat hook (start →
            subscribe → fetch) runs only once the visitor opens the launcher —
            no empty conversation is created on page load. */}
        <Popover.Content spacing="large" width="350px" height="450px">
          <InAppChat
            identityId={identityId}
            idempotencyKey={idempotencyKey}
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

export type { InAppChatButtonProps };

export default InAppChatButton;
