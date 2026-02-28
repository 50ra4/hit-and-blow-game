export type OutlineChipVariant = 'green' | 'blue' | 'orange' | 'purple' | 'red';

const VARIANT_STYLES: Record<OutlineChipVariant, string> = {
  green: 'bg-green-500/30 text-green-400',
  blue: 'bg-blue-500/30 text-blue-400',
  orange: 'bg-orange-500/30 text-orange-400',
  purple: 'bg-purple-500/30 text-purple-400',
  red: 'bg-red-500/30 text-red-400',
};

type OutlineChipProps = {
  label: string;
  variant: OutlineChipVariant;
  className?: string;
};

export function OutlineChip({ label, variant, className }: OutlineChipProps) {
  return (
    <span
      className={`rounded-full font-semibold ${VARIANT_STYLES[variant]} ${className ?? ''}`}
    >
      {label}
    </span>
  );
}
