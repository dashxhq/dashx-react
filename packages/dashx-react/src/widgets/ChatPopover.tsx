import { intlFormatDistance } from 'date-fns';

import { useDashXProvider, useInApp } from '../hooks/index.js';
import { Avatar, Button, Card, Flex, Heading, Popover, Text, Theme, Tooltip } from '../components';
import { BotMessageSquareIcon, X } from '../icons/index.js';
import React, { useEffect } from 'react';
import type { AiAgent } from '@dashx/browser';
import { Chat, type UseAgentProps } from './Chat.js';

const ChatPopup = (props: UseAgentProps) => {
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
  }, [dashX]);

  if (!agent) {
    return null;
  }

  return (
    <Theme>
      <Flex className="fixed right-4 bottom-4 z-50">
        <Popover.Root>
          <Popover.Trigger>
            <Button shape="square" roundness="full" variant="fill" size="large">
              <BotMessageSquareIcon />
            </Button>
          </Popover.Trigger>
          <Popover.Content spacing="large" width="350px" height="450px">
            <Popover.Header asChild>
              <Flex justify="between" align="center">
                <Flex align="center" gap={2}>
                  <Avatar size="small" src={agent.avatar} alt={agent.name}>
                    {agent.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </Avatar>
                  <Heading size={3}>{agent.name}</Heading>
                </Flex>
                <Popover.Close>
                  <Button
                    shape="square"
                    roundness="full"
                    variant="ghost"
                    mode="subtle"
                    inset="right"
                  >
                    <X />
                  </Button>
                </Popover.Close>
              </Flex>
            </Popover.Header>
            <Popover.Body>
              <Chat agent={agent} error={error} />
            </Popover.Body>
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </Theme>
  );
};

export default ChatPopup;
