import React from 'react';
import { MessageCircle } from 'lucide-react';

import { Button, Flex, Popover, Theme } from '../components';
import InAppChat, { type InAppChatWrapperProps } from './InAppChat.js';

type InAppChatButtonProps = InAppChatWrapperProps;

const InAppChatButton = ({ identityId, idempotencyKey, ...props }: InAppChatButtonProps) => (
  <Theme>
    <Flex className="fixed right-4 bottom-4 z-50">
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
