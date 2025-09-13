import React, { useState } from 'react';

import { Chat, type ChatWrapperProps } from './Chat.js';
import { Button, Flex, Popover, Theme } from '../components';
import { BotMessageSquareIcon } from '../icons/index.js';
import useAgent from '../hooks/use-agent.js';

const ChatPopup = ({ publicEmbedKey, ...props }: ChatWrapperProps) => {
  const { agent, messages, isThinking, error, sendMessage, conversationId } = useAgent({ publicEmbedKey });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Theme>
      <Flex className="fixed right-4 bottom-4 z-50">
        <Popover.Root onOpenChange={setIsPopoverOpen}>
          <Popover.Trigger>
            <Button shape="square" roundness="full" variant="fill" size="large">
              <BotMessageSquareIcon />
            </Button>
          </Popover.Trigger>
          <Popover.Content spacing="large" width="350px" height="450px">
            <Chat
              agent={agent}
              conversationId={conversationId}
              messages={messages}
              isThinking={isThinking}
              error={error}
              sendMessage={sendMessage}
              borderless
              withChatHeader
              withPopoverClose
              isPopoverOpen={isPopoverOpen}
              {...props}
            />
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </Theme>
  );
};

export default ChatPopup;
