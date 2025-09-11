import { useState, useEffect, useRef, useCallback } from 'react';

type UseAnimatedTextOptions = {
  text: string;
  speed?: number;
  onComplete?: () => void;
  enabled?: boolean;
};

type UseAnimatedTextReturn = {
  displayedText: string;
};

const useAnimatedText = ({
  text,
  speed = 8,
  onComplete,
  enabled = true
}: UseAnimatedTextOptions): UseAnimatedTextReturn => {
  const [displayedText, setDisplayedText] = useState('');

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const animate = useCallback(() => {
    if (currentIndexRef.current < text.length) {
      setDisplayedText(text.substring(0, currentIndexRef.current + 1));
      currentIndexRef.current++;
      timeoutRef.current = setTimeout(animate, speed);
    } else {
      onCompleteRef.current?.();
    }
  }, [text, speed]);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      return;
    }

    if (!enabled) {
      setDisplayedText(text);
      return;
    }

    currentIndexRef.current = 0;
    setDisplayedText('');
    animate();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, animate, enabled]);

  return {
    displayedText
  };
}

export default useAnimatedText;
