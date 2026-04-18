import type { ExpiryStatus } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface BadgeProps {
  status: ExpiryStatus;
  children: React.ReactNode;
}

const statusConfig: Record<ExpiryStatus, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-100 border-red-200', text: 'text-red-700', dot: 'bg-red-500 animate-pulse' },
  warning: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  normal: { bg: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export function Badge({ status, children }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
      config.bg, config.text,
    )}>
      <span className={cn('inline-block h-1.5 w-1.5 rounded-full', config.dot)} />
      {children}
    </span>
  );
}
