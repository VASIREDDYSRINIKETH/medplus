import { cn } from '../../lib/utils';

interface StockBadgeProps {
  stock: number;
  reorderLevel: number;
}

export function StockBadge({ stock, reorderLevel }: StockBadgeProps) {
  const isLow = stock <= reorderLevel;

  return (
    <div className="inline-flex flex-col items-center">
      <span
        className={cn(
          'text-sm font-bold',
          isLow ? 'text-red-600' : 'text-gray-900',
        )}
      >
        {stock}
      </span>
      {isLow && (
        <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-red-500">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          LOW STOCK
        </span>
      )}
    </div>
  );
}
