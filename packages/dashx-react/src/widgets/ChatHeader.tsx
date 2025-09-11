import React from 'react';
import type { AiAgent } from '@dashx/browser';

import { Flex, Heading } from '../components';

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

export type { ChatHeaderProps }

export default ChatHeader;
