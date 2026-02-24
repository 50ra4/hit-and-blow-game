import { useState, useCallback } from 'react';

const TOTAL_STEPS = 5;

type UseTutorialReturn = {
  step: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  prev: () => void;
};

export const useTutorial = (): UseTutorialReturn => {
  const [step, setStep] = useState(0);

  const next = useCallback((): void => {
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  const prev = useCallback((): void => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    step,
    totalSteps: TOTAL_STEPS,
    isFirst: step === 0,
    isLast: step === TOTAL_STEPS - 1,
    next,
    prev,
  };
};
