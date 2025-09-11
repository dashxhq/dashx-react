import { useRef, useCallback, useEffect } from 'react';

const SCROLL_BOTTOM_THRESHOLD = 100;

type UseAutoScrollOptions = {
  threshold?: number;
};

type UseAutoScrollReturn = {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: (options?: { smooth?: boolean }) => void;
  checkIfUserAtBottom: () => void;
  isUserAtBottom: boolean;
};

const useAutoScroll = ({ 
  threshold = SCROLL_BOTTOM_THRESHOLD
}: UseAutoScrollOptions = {}): UseAutoScrollReturn => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);

  const scrollToBottom = useCallback(({ smooth = false } = {}) => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    }
  }, []);

  const checkIfUserAtBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        isUserAtBottomRef.current = distanceFromBottom <= threshold;
      }
    }
  }, [threshold]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      const handleScroll = () => {
        checkIfUserAtBottom();
      };
      
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [checkIfUserAtBottom]);

  return {
    scrollAreaRef,
    scrollToBottom,
    checkIfUserAtBottom,
    isUserAtBottom: isUserAtBottomRef.current
  };
};

export default useAutoScroll;
