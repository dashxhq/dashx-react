import { intlFormatDistance } from 'date-fns';

import { useDashXProvider, useInApp } from '../hooks/index.js';
import { Button, Card, Flex, Heading, Popover, Text, Theme, Tooltip } from '../components';
import { BotMessageSquareIcon } from '../icons/index.js';
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
