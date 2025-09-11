import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { KeyboardEvent } from 'react';

import { Button, Flex, TextArea } from '../components';

type ChatFooterProps = {
  sendMessage: (message: string) => void;
  isDisabled?: boolean;
};

const ChatFooter = ({ sendMessage, isDisabled = false }: ChatFooterProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="shrink-0 grow-0 border-t border-t-gray-400/40">
      <Flex gap={2} align="end" className="w-full">
        <div className="w-full [&_textarea]:!border-none [&_textarea]:!outline-none">
          <TextArea
            aria-label="message"
            size="extralarge"
            placeholder="Ask anything..."
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
            isDisabled={!inputValue.trim() || isDisabled}
          >
            <Send size={20} />
          </Button>
        </div>
      </Flex>
    </div>
  )
}

export type { ChatFooterProps }

export default ChatFooter;
