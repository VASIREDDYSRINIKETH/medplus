import type { Medicine } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { getExpiryStatus, getDaysUntilExpiry, cn } from '../../lib/utils';
import { Spinner } from '../../components/ui/Spinner';

interface ExpiryListProps {
  medicines: Medicine[];
  isLoading: boolean;
}

export function ExpiryList({ medicines, isLoading }: ExpiryListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner />
        <p className="mt-4 text-sm text-gray-500">Loading expiry data...</p>
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 mb-4">
          <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-gray-600">All Clear!</p>
        <p className="mt-1 text-sm text-gray-400">No medicines are near expiry. Inventory looks healthy.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {medicines.map((med, i) => {
        const status = getExpiryStatus(med.expiry_date);
        const daysLeft = getDaysUntilExpiry(med.expiry_date);

        const borderColor = status === 'critical' ? 'border-red-200 hover:border-red-300' :
          status === 'warning' ? 'border-amber-200 hover:border-amber-300' :
          'border-gray-200 hover:border-gray-300';

        const accentBg = status === 'critical' ? 'from-red-500 to-rose-500' :
          status === 'warning' ? 'from-amber-500 to-orange-500' :
          'from-emerald-500 to-emerald-600';

        const staggerClass = 'stagger-' + Math.min((i % 3) + 1, 4);

        return (
          <div key={med.id}
            className={cn(
              'animate-slide-up',
              staggerClass,
              'group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5',
              borderColor,
            )}>
            <div className={cn('absolute top-0 left-0 h-1 w-full bg-gradient-to-r', accentBg)} />

            <div className="mt-1 mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white bg-gradient-to-br', accentBg)}>
                  {med.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{med.name}</h3>
                  <p className="text-xs text-gray-400">{med.salt}</p>
                </div>
              </div>
              <Badge status={status}>
                {daysLeft <= 0 ? 'Expired' : daysLeft + 'd'}
              </Badge>
            </div>

            <div className="space-y-2.5 rounded-xl bg-gray-50 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  Stock
                </span>
                <span className="font-semibold text-gray-700">{med.stock} units</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Expiry
                </span>
                <span className="font-semibold text-gray-700">{med.expiry_date}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Supplier
                </span>
                <span className="truncate max-w-[140px] font-semibold text-gray-700">{med.supplier_email}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
