import type { ReactNode } from 'react';

type TutorialStepProps = {
  step: number;
  totalSteps: number;
  children: ReactNode;
};

export function TutorialStep({
  step,
  totalSteps,
  children,
}: TutorialStepProps) {
  return (
    <div className="flex flex-col">
      {/* ページネーションドット */}
      <div className="mb-6 flex justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-6 bg-indigo-400' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* コンテンツ */}
      <div className="min-h-64">{children}</div>
    </div>
  );
}
