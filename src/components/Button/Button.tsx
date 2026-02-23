type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
};

const VARIANT_CLASSES = {
  primary:
    'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/30',
  secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-red-600/30',
} as const;

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2 font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${VARIANT_CLASSES[variant]} ${disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5 active:translate-y-0'} ${className ?? ''} `}
    >
      {children}
    </button>
  );
}
