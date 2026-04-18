import { useMemo } from 'react';
import { useExpiry } from '../hooks/useExpiry';
import { ExpiryList } from '../features/expiry';
import { getDaysUntilExpiry } from '../lib/utils';

export default function ExpiryPage() {
  const { nearExpiry, isLoading, isError } = useExpiry();

  const counts = useMemo(() => {
    const expired = nearExpiry.filter((m) => getDaysUntilExpiry(m.expiry_date) <= 0).length;
    const critical = nearExpiry.filter((m) => { const d = getDaysUntilExpiry(m.expiry_date); return d > 0 && d < 30; }).length;
    const warning = nearExpiry.filter((m) => { const d = getDaysUntilExpiry(m.expiry_date); return d >= 30 && d < 90; }).length;
    return { expired, critical, warning, total: nearExpiry.length };
  }, [nearExpiry]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Expiry Tracker</h1>
        <p className="mt-2 text-sm text-gray-500">
          Monitor medicines expiring within the next 90 days. Take action before it's too late.
        </p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
          <p className="text-xs font-medium text-gray-500 mt-1">Total Flagged</p>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{counts.expired}</p>
          <p className="text-xs font-medium text-red-500 mt-1">Expired</p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{counts.critical}</p>
          <p className="text-xs font-medium text-orange-500 mt-1">Critical (&lt;30d)</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{counts.warning}</p>
          <p className="text-xs font-medium text-amber-500 mt-1">Warning (&lt;90d)</p>
        </div>
      </div>

      {isError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-red-800">Failed to load expiry data. Please try again.</p>
        </div>
      )}

      <ExpiryList medicines={nearExpiry} isLoading={isLoading} />
    </div>
  );
}
