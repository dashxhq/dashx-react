import React, { useState } from 'react';

import { cn } from '../utils/cn.js';
import { Button, Flex, Theme, Popover } from '../components';
import { useAgent } from '../hooks';
import { X } from '../icons';
import ChatHeader from './ChatHeader.js';
import ChatBody from './ChatBody.js';
import ChatFooter from './ChatFooter.js';

type ChatProps = {
  publicEmbedKey: string;
  withChatHeader?: boolean;
  withPopoverClose?: boolean;
  borderless?: boolean;
}

const Chat = ({ publicEmbedKey, withChatHeader = false, withPopoverClose = false, borderless = false }: ChatProps) => {
  const { agent, messages, isThinking, error, sendMessage } = useAgent({ publicEmbedKey });
  const [isAnimating, setIsAnimating] = useState(false);

  if (!agent) {
    return (
      <Theme asChild>
        <Flex direction="column" className="h-full">
          <div className="text-red-600 p-4">
            {error
              ? `Error loading chat agent: ${error}`
              : 'Loading chat agent...'}
          </div>
        </Flex>
      </Theme>
    );
  }

  return (
    <Theme asChild>
      <Flex direction="column" className={cn("h-full", !borderless && "border border-gray-400/40")}>
        {withChatHeader && (
          <ChatHeader agent={agent}>
            {withPopoverClose && (
              <Popover.Close>
                <Button shape="square" roundness="full" variant="ghost" mode="subtle" inset="right">
                  <X />
                </Button>
              </Popover.Close>
            )}
          </ChatHeader>
        )}
        <ChatBody
          agent={agent}
          messages={messages}
          isThinking={isThinking}
          error={error}
          sendMessage={sendMessage}
          setIsAnimating={setIsAnimating}
        />
        <ChatFooter sendMessage={sendMessage} isDisabled={isThinking || isAnimating} />
      </Flex>
    </Theme>
  );
};

export type { ChatProps };

export default Chat;
