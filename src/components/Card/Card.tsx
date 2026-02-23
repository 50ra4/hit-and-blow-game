type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5 ${className ?? ''} `}
    >
      {children}
    </div>
  );
}
