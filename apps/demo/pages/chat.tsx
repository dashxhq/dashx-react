import dynamic from 'next/dynamic';
import React from 'react';

import { Chat, ChatPopover } from '@dashx/react/widgets';
import { Flex } from '@dashx/react';

const DashXProvider = dynamic(() => import('@dashx/react').then((mod) => mod.DashXProvider), {
  ssr: false,
});

function ChatPage() {
  return (
    <DashXProvider
      baseUri={process.env.NEXT_PUBLIC_DASHX_BASE_URI}
      realtimeBaseUri={process.env.NEXT_PUBLIC_DASHX_REALTIME_URI}
      publicKey={process.env.NEXT_PUBLIC_DASHX_PUBLIC_KEY}
      targetEnvironment={process.env.NEXT_PUBLIC_DASHX_TARGET_ENVIRONMENT}
      targetProduct={process.env.NEXT_PUBLIC_DASHX_TARGET_PRODUCT}
    >
      <Flex
        direction="column"
        gap={4}
        style={{
          background: '#f9f9f9',
          maxWidth: 640,
          height: '100%',
          margin: 'auto',
        }}
      >
        <Chat
          agent="algebra-tutor"
          publicEmbedKey="eNg9OShAKCzt9iF4BBLCsW5lPtyCZGkNMklLNi7pTN9aqjrAYJrQvjaH2VAVHVKH"
        />
      </Flex>
      <ChatPopover
        agent="algebra-tutor"
        publicEmbedKey="eNg9OShAKCzt9iF4BBLCsW5lPtyCZGkNMklLNi7pTN9aqjrAYJrQvjaH2VAVHVKH"
      />
    </DashXProvider>
  );
}

export default ChatPage;
