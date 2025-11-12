/**
 * Custom hook for countdown timer
 */

import {useState, useEffect, useRef, useCallback} from 'react';

interface UseTimerOptions {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export const useTimer = ({
  initialSeconds,
  onComplete,
  autoStart = false,
}: UseTimerOptions) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(initialSeconds);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialSeconds]);

  const restart = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onComplete]);

  const isComplete = seconds === 0;
  const progress = 1 - seconds / initialSeconds;

  return {
    seconds,
    isRunning,
    isComplete,
    progress,
    start,
    pause,
    reset,
    restart,
  };
};
