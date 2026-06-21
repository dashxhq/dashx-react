import * as ScrollArea from '@radix-ui/react-scroll-area';
import React, { useEffect, useState } from 'react';
import { Send, X } from 'lucide-react';
import type { KeyboardEvent } from 'react';

import { Button, Flex, Heading, Popover, Text, TextArea, Theme } from '../components';
import { cn } from '../utils/cn.js';
import useAutoScroll from '../hooks/use-auto-scroll.js';
import useInAppChat, {
  type InAppChatMessage,
  type UseInAppChatHookProps,
  type UseInAppChatHookResponse,
} from '../hooks/use-in-app-chat.js';

type InAppChatProps = UseInAppChatHookResponse & {
  withChatHeader?: boolean;
  withPopoverClose?: boolean;
  borderless?: boolean;
  title?: string;
};

const messageText = (message: InAppChatMessage): string => {
  const content = message.renderedContent;
  if (typeof content === 'string') return content;
  return content?.text ?? '';
};

const isOutgoing = (message: InAppChatMessage): boolean => message.aiRole?.toUpperCase() === 'USER';

const InAppChat = ({
  messages,
  isLoading,
  error,
  sendMessage,
  withChatHeader = false,
  withPopoverClose = false,
  borderless = false,
  title = 'Chat',
}: InAppChatProps) => {
  const [inputValue, setInputValue] = useState('');
  const { scrollAreaRef, scrollToBottom } = useAutoScroll();

  useEffect(() => {
    setTimeout(() => scrollToBottom({ smooth: true }), 0);
  }, [messages.length, scrollToBottom]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    // `sendMessage` is synchronous: it returns true the instant the message is
    // optimistically queued (network send runs in the background). Clear the
    // composer right away on success so a fast second Enter can't re-send the same
    // text as a duplicate; on false (chat not ready) keep the visitor's text.
    if (sendMessage(inputValue)) setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Theme asChild>
      <Flex direction="column" className={cn('h-full', !borderless && 'border border-gray-400/40')}>
        {withChatHeader && (
          <Flex align="center" justify="between" className="border-b border-b-gray-400/40 px-6 py-4">
            <Heading size={3}>{title}</Heading>
            {withPopoverClose && (
              <Popover.Close>
                <Button shape="square" roundness="full" variant="ghost" mode="subtle" inset="right">
                  <X />
                </Button>
              </Popover.Close>
            )}
          </Flex>
        )}

        <Flex direction="column" className="grow overflow-auto bg-gray-50">
          <ScrollArea.Root ref={scrollAreaRef} className="h-full grow-1 p-6">
            <ScrollArea.Viewport className="h-full">
              <Flex direction="column" gap={3}>
                {messages.map((message) => (
                  <div
                    key={message.externalUid || message.id}
                    className={cn(
                      'max-w-[80%] rounded-lg py-2 px-3',
                      isOutgoing(message)
                        ? 'bg-accent-600 ml-auto items-end text-white'
                        : 'bg-gray-200 mr-auto items-start text-gray-900',
                    )}
                  >
                    <Text as="p" size={2}>{messageText(message)}</Text>
                  </div>
                ))}

                {isLoading && (
                  <Text as="p" size={2} className="mr-auto text-gray-500">
                    Loading…
                  </Text>
                )}

                {error && (
                  <Text
                    as="p"
                    size={2}
                    className="bg-negative-100 text-negative-900 mx-auto rounded-lg py-2 px-3"
                  >
                    {error}
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

        <div className="shrink-0 grow-0 border-t border-t-gray-400/40">
          <Flex gap={2} align="end" className="w-full">
            <div className="w-full [&_textarea]:!border-none [&_textarea]:!outline-none">
              <TextArea
                aria-label="message"
                size="extralarge"
                placeholder="Type a message…"
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
                isDisabled={!inputValue.trim()}
              >
                <Send size={20} />
              </Button>
            </div>
          </Flex>
        </div>
      </Flex>
    </Theme>
  );
};

type InAppChatWrapperProps = Omit<InAppChatProps, keyof UseInAppChatHookResponse> & UseInAppChatHookProps;

const InAppChatWrapper = ({ identityId, idempotencyKey, initialMessage, ...props }: InAppChatWrapperProps) => {
  const chat = useInAppChat({ identityId, idempotencyKey, initialMessage });
  return <InAppChat {...chat} {...props} />;
};

export type { InAppChatProps, InAppChatWrapperProps };

export { InAppChat };

export default InAppChatWrapper;
