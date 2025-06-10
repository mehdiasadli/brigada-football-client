import { useCallback, useEffect, useRef, useState } from 'react';

function defaultFormatter(time: number) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

interface UseCountdownProps {
  intervalMs?: number;
  startTimeMs?: number;
  finishTimeMs?: number;
  autoStart?: boolean;
  onStart?: () => void;
  onInterval?: (time: number) => void;
  onFinish?: () => void;
  format?: (time: number) => string;
}

interface UseCountdownReturn {
  time: number;
  formattedTime: string;
  isRunning: boolean;
  isFinished: boolean;
  secondsLeft: number;
  reset: () => void; // resets the countdown to the start time
  resetAndStart: () => void; // resets the countdown to the start time and auto starts it
  start: () => void; // starts the countdown
  stop: () => void; // stops the countdown
  pause: () => void; // pauses the countdown
  resume: () => void; // resumes the countdown
}

export function useCountdown(options: UseCountdownProps = {}): UseCountdownReturn {
  const {
    intervalMs = 1000,
    startTimeMs = 60 * 1000, // 60 seconds
    finishTimeMs = 0,
    autoStart = true,
    format = defaultFormatter,
    onStart,
    onInterval,
    onFinish,
  } = options;

  const [time, setTime] = useState(startTimeMs);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Store start time and remaining time in localStorage
  const storageKey = useRef(`countdown-${Date.now()}`);

  useEffect(() => {
    // Initialize from localStorage if exists
    const stored = localStorage.getItem(storageKey.current);
    if (stored) {
      const { startTime, remainingTime } = JSON.parse(stored);
      const elapsed = Date.now() - startTime;
      const currentTime = Math.max(remainingTime - elapsed, finishTimeMs);
      setTime(currentTime);
      if (currentTime === finishTimeMs) {
        setIsFinished(true);
        onFinish?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoStart) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: number;

    if (isRunning && !isFinished) {
      const startTime = Date.now();
      localStorage.setItem(
        storageKey.current,
        JSON.stringify({
          startTime,
          remainingTime: time,
        })
      );

      interval = window.setInterval(() => {
        setTime((currentTime) => {
          const newTime = Math.max(currentTime - intervalMs, finishTimeMs);
          onInterval?.(newTime);

          if (newTime === finishTimeMs) {
            setIsFinished(true);
            setIsRunning(false);
            onFinish?.();
            clearInterval(interval);
          }

          return newTime;
        });
      }, intervalMs);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, isFinished]);

  const start = useCallback(() => {
    if (!isFinished) {
      setIsRunning(true);
      onStart?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setTime(startTimeMs);
    setIsFinished(false);
    localStorage.removeItem(storageKey.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (!isFinished) {
      setIsRunning(true);
    }
  }, [isFinished]);

  const reset = useCallback(() => {
    stop();
  }, [stop]);

  const resetAndStart = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  return {
    time,
    formattedTime: format(time),
    isRunning,
    isFinished,
    secondsLeft: Math.floor(time / 1000),
    reset,
    resetAndStart,
    start,
    stop,
    pause,
    resume,
  };
}
