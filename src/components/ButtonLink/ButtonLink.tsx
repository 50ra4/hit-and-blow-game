import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { BUTTON_VARIANT_CLASSES } from '@/components/Button/Button';

type ButtonLinkProps = {
  children: React.ReactNode;
  to: LinkProps['to'];
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
};

export function ButtonLink({
  children,
  to,
  variant = 'primary',
  className,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-block rounded-xl px-4 py-2 text-center font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 active:translate-y-0 ${BUTTON_VARIANT_CLASSES[variant]} ${className ?? ''}`}
    >
      {children}
    </Link>
  );
}
