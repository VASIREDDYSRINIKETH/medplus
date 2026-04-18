import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  className,
  disabled,
  loading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' &&
          'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        variant === 'secondary' &&
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
        variant === 'danger' &&
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="!h-4 !w-4 !border-2" />}
      {children}
    </button>
  );
}
