import uuid from 'uuid-random';
import { useState, useEffect, useCallback } from 'react';
import type { AiAgent, AiMessage } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';

type UseAgentHookProps = {
  publicEmbedKey: string;
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
          role: 'user',
          content: text
        } as AiMessage]);
        setIsThinking(true);
        setError(null);

        const response = await dashX.invokeAiAgent({
          conversationId,
          prompt: text,
          publicEmbedKey,
        });

        if (response.conversationId && !conversationId) {
          setConversationId(response.conversationId);
        }

        setMessages((prev) => [...prev, response]);
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

export default useAgent;
