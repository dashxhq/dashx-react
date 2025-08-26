import React, { useEffect } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import type { AiAgent } from '@dashx/browser';

import { useDashXProvider } from '../hooks';
import { Button, Flex, Text, TextArea, Theme } from '../components';

const useAgent = (props: UseAgentProps) => {
  const dashX = useDashXProvider();
  const [agent, setAgent] = React.useState<AiAgent>();
  const [error, setError] = React.useState<Error>();

  useEffect(() => {
    dashX
      .loadAiAgent({
        agent: props.agent,
        publicEmbedKey: props.publicEmbedKey,
      })
      .then((agent) => setAgent(agent))
      .catch((err) => setError(err));
  }, [dashX, props.agent, props.publicEmbedKey]);

  return { agent, error };
};

type UseAgentProps = { agent: string; publicEmbedKey: string };
type ChatProps = { agent: AiAgent; publicEmbedKey?: undefined };

const Chat = ({ agent, error }: ReturnType<typeof useAgent>) => {
  if (!agent) {
    if (error) {
      return (
        <Theme asChild>
          <Flex direction="column" className="h-full">
            <div className="p-4 text-red-600">Error loading chat agent: {error.message}</div>
          </Flex>
        </Theme>
      );
    }
    return (
      <Theme asChild>
        <Flex direction="column" className="h-full items-center justify-center">
          <div className="p-4">Loading chat agent...</div>
        </Flex>
      </Theme>
    );
  }

  return (
    <Theme asChild>
      <Flex direction="column" className="h-full">
        <ScrollArea.Root className="h-[calc(100%-64px)] grow-1">
          <ScrollArea.Viewport className="h-full">
            {agent.starterMessages && (
              <Flex direction="column" gap={4} className="p-4">
                {agent.starterMessages.map((msg, index) => (
                  <Text as="p" key={index}>
                    {msg.content}
                  </Text>
                ))}
              </Flex>
            )}
            {agent.starterSuggestions && (
              <Flex gap={4} className="p-4">
                {agent.starterSuggestions.map((suggestion, index) => (
                  <Button key={index} variant="simple" mode="subtle" roundness="full" size="small">
                    {suggestion.label || suggestion.content}
                  </Button>
                ))}
              </Flex>
            )}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal" className="h-2 bg-gray-200 opacity-50">
            <ScrollArea.Thumb className="flex-1 rounded-2xl bg-gray-400" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Scrollbar orientation="vertical" className="w-2 bg-gray-200 opacity-50">
            <ScrollArea.Thumb className="flex-1 rounded-2xl bg-gray-400" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>

        <div className="shrink-0 grow-0">
          <TextArea size="extralarge" placeholder="Ask anything..." />
        </div>
      </Flex>
    </Theme>
  );
};

const ChatWrapper = (props: UseAgentProps) => {
  const { agent, error } = useAgent(props);
  return <Chat agent={agent} error={error} />;
};

export default ChatWrapper;
export { Chat };
export type { UseAgentProps };
