import React, { useEffect } from 'react';
import type { AiAgent } from '@dashx/browser';

import Chat, { type ChatProps } from './Chat.js';
import { Button, Flex, Popover, Theme } from '../components';
import { BotMessageSquareIcon } from '../icons/index.js';
import { useDashXProvider } from '../hooks/index.js';

const ChatPopup = (props: ChatProps) => {
  const dashX = useDashXProvider();

  const [agent, setAgent] = React.useState<AiAgent>();

  useEffect(() => {
    dashX
      .loadAiAgent({
        agent: props.identifier,
        publicEmbedKey: props.publicEmbedKey,
      })
      .then((agent) => setAgent(agent))
      .catch((err) => console.error('Failed to load agent:', err));
  }, [dashX, props.identifier, props.publicEmbedKey]);

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
            <Chat
              className="border-none"
              identifier={props.identifier} 
              publicEmbedKey={props.publicEmbedKey} 
              withChatHeader
              withPopoverClose
            />
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </Theme>
  );
};

export default ChatPopup;
