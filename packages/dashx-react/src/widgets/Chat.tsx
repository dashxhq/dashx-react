import * as ScrollArea from '@radix-ui/react-scroll-area';
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { AiAgent, AiMessage, AiAgentStarterSuggestion } from '@dashx/browser';
import type { KeyboardEvent } from 'react';

import { cn } from '../utils/cn.js';
import { Button, Flex, Text, TextArea, Theme, Heading, Popover, MarkdownRenderer } from '../components';
import { useAgent } from '../hooks';
import { X } from '../icons';

type ChatProps = {
  publicEmbedKey: string;
  withChatHeader?: boolean;
  withPopoverClose?: boolean;
}

const Chat = ({ publicEmbedKey, withChatHeader = false, withPopoverClose = false }: ChatProps) => {
  const { agent, messages, isThinking, error, sendMessage } = useAgent({ publicEmbedKey });


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
      <Flex direction="column" className="h-full border border-gray-400/40">
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
        />
        <ChatFooter sendMessage={sendMessage} isThinking={isThinking} />
      </Flex>
    </Theme>
  );
};

type ChatHeaderProps = {
  agent: AiAgent;
  children?: React.ReactNode;
};

const ChatHeader = ({ agent, children }: ChatHeaderProps) => {
  return (
    <Flex
      align="center"
      className="border-b border-b-gray-400/40 px-6 py-4"
      justify="between"
    >
      <Heading size={3}>{agent.name}</Heading>
      {children}
    </Flex>
  );
};

const AGENT_MESSAGE_WIDTH_CLASS = 'max-w-[max(80%,350px)]';
const USER_MESSAGE_WIDTH_CLASS = 'max-w-[80%]';

type ChatBodyProps = {
  agent: AiAgent;
  messages: AiMessage[];
  isThinking: boolean;
  error: string | null;
  sendMessage: (message: string) => void;
};

const ChatBody = ({ agent, messages, isThinking, error, sendMessage }: ChatBodyProps) => {
  const handleSuggestionClick = (suggestion: AiAgentStarterSuggestion) => {
    sendMessage(suggestion.content);
  };

  const renderMessage = (message: AiMessage, index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <div 
        key={message.id || index}
        className={cn([
          isUser
            ? `ml-auto items-end bg-bg rounded-lg px-3 py-2 ${USER_MESSAGE_WIDTH_CLASS}`
            : `mr-auto items-start ${AGENT_MESSAGE_WIDTH_CLASS}`
        ])}
      >
        <MarkdownRenderer>
          {message.content || ''}
        </MarkdownRenderer>
      </div>
    );
  };

  return (
    <Flex
      direction="column"
      className="grow overflow-auto bg-gray-50"
    >
      <ScrollArea.Root className="h-full grow-1 p-6">
        <ScrollArea.Viewport className="h-full">
          <Flex direction="column" gap={6}>
            {agent.starterMessages?.map((msg, index) => (
              <div
                key={`message-${index}`}
                className={cn("mr-auto items-start", AGENT_MESSAGE_WIDTH_CLASS)}
              >
                <MarkdownRenderer>
                  {msg.content || ''}
                </MarkdownRenderer>
              </div>
            ))}

            {agent.starterSuggestions && messages.length === 0 && (
              <Flex gap={2} wrap="wrap">
                {agent.starterSuggestions.map((suggestion, index) => (
                  <Button
                    key={`suggestion-${index}`}
                    variant="fill"
                    mode="subtle"
                    roundness="full"
                    size="extrasmall"
                    onPress={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.label || suggestion.content}
                  </Button>
                ))}
              </Flex>
            )}

            {messages.map((message, index) => renderMessage(message, index))}

            {isThinking && (
              <Text as="p" size={2} className="text-gray-500 mr-auto items-start">Thinking...</Text>
            )}

            {error && (
              <Text as="p" size={2} className="bg-negative-100 text-negative-900 mx-auto items-start rounded-lg px-3 py-2">
                Error: {error}
              </Text>
            )}
          </Flex>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" className="w-1 bg-gray-200 opacity-50">
          <ScrollArea.Thumb className="flex-1 rounded-2xl bg-gray-400" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </Flex>
  );
};

type ChatFooterProps = {
  sendMessage: (message: string) => void;
  isThinking: boolean;
};

const ChatFooter = ({ sendMessage, isThinking }: ChatFooterProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="shrink-0 grow-0 border-t border-t-gray-400/40">
      <Flex gap={2} align="end" className="w-full">
        <div className="w-full [&_textarea]:!border-none [&_textarea]:!outline-none">
          <TextArea
            aria-label="message"
            size="extralarge"
            placeholder="Ask anything..."
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={(text) => setInputValue(text)}
            roundness="none"
            autogrow
          />
        </div>
        <div className="mr-[7px] mb-[7px]">
          <Button 
            shape="square"
            roundness="full"
            variant="fill"
            size="medium"
            onPress={handleSubmit}
            isDisabled={!inputValue.trim() || isThinking}
          >
            <Send size={20} />
          </Button>
        </div>
      </Flex>
    </div>
  )
}

export type { ChatProps };

export default Chat;
