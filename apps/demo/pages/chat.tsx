import dynamic from 'next/dynamic';
import React from 'react';

import { Flex, Theme, Chat, ChatPopover } from '@dashx/react';

const DashXProvider = dynamic(() => import('@dashx/react').then((mod) => mod.DashXProvider), {
  ssr: false,
});

function ChatPage() {
  return (
    <Theme>
      <DashXProvider
        baseUri={process.env.NEXT_PUBLIC_DASHX_BASE_URI}
        realtimeBaseUri={process.env.NEXT_PUBLIC_DASHX_REALTIME_URI}
        publicKey={process.env.NEXT_PUBLIC_DASHX_PUBLIC_KEY}
        targetEnvironment={process.env.NEXT_PUBLIC_DASHX_TARGET_ENVIRONMENT}
        targetProduct={process.env.NEXT_PUBLIC_DASHX_TARGET_PRODUCT}
      >
        <Flex
          align="center"
          justify="center"
          style={{
            maxWidth: 900,
            height: 640,
            margin: '2rem auto',
          }}
        >
          <Chat
            publicEmbedKey={process.env.NEXT_PUBLIC_DASHX_AI_AGENT_PUBLIC_EMBED_KEY}
          />
        </Flex>
        <ChatPopover
          publicEmbedKey={process.env.NEXT_PUBLIC_DASHX_AI_AGENT_PUBLIC_EMBED_KEY}
        />
      </DashXProvider>
    </Theme>
  );
}

export default ChatPage;
