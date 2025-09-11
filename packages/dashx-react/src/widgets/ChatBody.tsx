import * as ScrollArea from '@radix-ui/react-scroll-area';
import React, { useEffect, useRef, useCallback } from 'react';
import type { AiAgent, AiMessage, AiAgentStarterSuggestion } from '@dashx/browser';

import { cn } from '../utils/cn.js';
import { Button, Flex, Text, MarkdownRenderer } from '../components';

const AGENT_MESSAGE_WIDTH_CLASS = 'max-w-[max(80%,350px)]';
const USER_MESSAGE_WIDTH_CLASS = 'max-w-[80%]';

type ChatBodyProps = {
  agent: AiAgent;
  messages: AiMessage[];
  isThinking: boolean;
  error: string | null;
  sendMessage: (message: string) => void;
  setIsAnimating: (animating: boolean) => void;
};

const ChatBody = ({ agent, messages, isThinking, error, sendMessage, setIsAnimating }: ChatBodyProps) => {
  const previousMessageCountRef = useRef(messages.length);
  
  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, [setIsAnimating]);
  
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const hasNewMessage = messages.length > previousMessageCountRef.current;
    
    if (hasNewMessage && lastMessage?.role === 'assistant') {
      setIsAnimating(true);
    }
    
    previousMessageCountRef.current = messages.length;
  }, [messages, isThinking, setIsAnimating]);

  const handleSuggestionClick = (suggestion: AiAgentStarterSuggestion) => {
    sendMessage(suggestion.content);
  };

  const renderMessage = (message: AiMessage, index: number) => {
    const isUser = message.role === 'user';
    const isLastMessage = index === messages.length - 1;
    const isLastAgentMessage = isLastMessage && !isUser;
    
    return (
      <div 
        key={message.id || index}
        className={cn([
          isUser
            ? `ml-auto items-end bg-bg rounded-lg px-3 py-2 ${USER_MESSAGE_WIDTH_CLASS}`
            : `mr-auto items-start ${AGENT_MESSAGE_WIDTH_CLASS}`
        ])}
      >
        <MarkdownRenderer animate={isLastAgentMessage} onAnimationComplete={handleAnimationComplete}>
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

export type { ChatBodyProps }

export default ChatBody;
