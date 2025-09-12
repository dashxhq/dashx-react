import React, { useState } from 'react';

import { cn } from '../utils/cn.js';
import { Button, Flex, Theme, Popover } from '../components';
import { X } from '../icons';
import ChatHeader from './ChatHeader.js';
import ChatBody from './ChatBody.js';
import ChatFooter from './ChatFooter.js';
import useAgent, { type UseAgentHookResponse } from '../hooks/use-agent.js';

type ChatProps = UseAgentHookResponse & {
  withChatHeader?: boolean;
  withPopoverClose?: boolean;
  borderless?: boolean;
}

const Chat = ({
  agent,
  messages,
  isThinking,
  error,
  sendMessage,
  withChatHeader = false,
  withPopoverClose = false,
  borderless = false,
}: ChatProps) => {
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
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
        />
        <ChatFooter sendMessage={sendMessage} isDisabled={isThinking || isAnimating} />
      </Flex>
    </Theme>
  );
};

type ChatWrapperProps = Omit<ChatProps, keyof UseAgentHookResponse> & { publicEmbedKey: string };

const ChatWrapper = ({ publicEmbedKey, ...props }: ChatWrapperProps) => {
  const { agent, messages, isThinking, error, sendMessage, conversationId } = useAgent({ publicEmbedKey });
  return (
    <Chat
      agent={agent}
      conversationId={conversationId}
      messages={messages}
      isThinking={isThinking}
      error={error}
      sendMessage={sendMessage}
      {...props}
    />
  );
};

export type { ChatProps, ChatWrapperProps };

export { Chat };

export default ChatWrapper;
