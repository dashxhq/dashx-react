import uuid from 'uuid-random';
import { useState, useEffect, useCallback } from 'react';
import type { AiAgent } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';

type UseAgentHookProps = {
  publicEmbedKey: string;
}

// UI-level chat message. `aiRole` is a presentation concern maintained by the
// hook (the SDK's invokeAiAgent messages don't carry a role) to distinguish
// user-entered messages from agent responses.
type AiMessage = {
  id: string;
  aiRole: 'user' | 'assistant';
  renderedContent: any;
}

type UseAgentHookResponse = {
  agent?: AiAgent;
  conversationId: string | null;
  messages: AiMessage[];
  isThinking: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
}

const useAgent = ({ publicEmbedKey }: UseAgentHookProps): UseAgentHookResponse => {
  const dashX = useDashXProvider();

  const [agent, setAgent] = useState<AiAgent>();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashX
      .loadAiAgent({
        publicEmbedKey,
      })
      .then((agent) => {
        setAgent(agent);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      });
  }, [dashX, publicEmbedKey]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !agent) return;

      try {
        setMessages((prev) => [...prev, {
          id: uuid(),
          aiRole: 'user',
          renderedContent: text,
        }]);
        setIsThinking(true);
        setError(null);

        const response = await dashX.invokeAiAgent({
          conversationId,
          prompt: text,
          publicEmbedKey,
        });

        const responseConversationId = response.messages.find(
          (message) => message.conversationId,
        )?.conversationId;
        if (responseConversationId && !conversationId) {
          setConversationId(responseConversationId);
        }

        setMessages((prev) => [
          ...prev,
          ...response.messages.map((message) => ({
            id: message.id,
            aiRole: 'assistant' as const,
            renderedContent: message.renderedContent,
          })),
        ]);
      } catch (err) {
        setError('Failed to send message');
      } finally {
        setIsThinking(false);
      }
    },
    [dashX, agent, publicEmbedKey, conversationId]
  );

  return {
    agent,
    conversationId,
    messages,
    isThinking,
    error,
    sendMessage,
  };
};

export type { UseAgentHookProps, UseAgentHookResponse, AiMessage };

export default useAgent;
