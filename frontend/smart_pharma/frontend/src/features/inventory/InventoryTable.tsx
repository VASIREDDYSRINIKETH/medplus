import { useState, useMemo } from 'react';
import type { Medicine } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { StockBadge } from '../../components/ui/StockBadge';
import { Spinner } from '../../components/ui/Spinner';
import { getExpiryStatus, getDaysUntilExpiry, cn } from '../../lib/utils';
import { SellModal } from '../sell/SellModal';

interface InventoryTableProps {
  medicines: Medicine[];
  isLoading: boolean;
}

type SortField = 'name' | 'stock' | 'expiry_date';
type SortDir = 'asc' | 'desc';

const PAGE_SIZES = [5, 10, 25];

export function InventoryTable({ medicines, isLoading }: InventoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sellTarget, setSellTarget] = useState<Medicine | null>(null);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...medicines];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'stock') cmp = a.stock - b.stock;
      else if (sortField === 'expiry_date')
        cmp = getDaysUntilExpiry(a.expiry_date) - getDaysUntilExpiry(b.expiry_date);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [medicines, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 inline-flex flex-col leading-none text-[10px]">
      <span className={sortField === field && sortDir === 'asc' ? 'text-indigo-600' : 'text-gray-300'}>&#9650;</span>
      <span className={sortField === field && sortDir === 'desc' ? 'text-indigo-600' : 'text-gray-300'}>&#9660;</span>
    </span>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner />
        <p className="mt-4 text-sm text-gray-500">Loading inventory...</p>
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-base font-semibold text-gray-600">No medicines found</p>
        <p className="mt-1 text-sm text-gray-400">Inventory is empty or no results match your search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none" onClick={() => toggleSort('name')}>
                  Medicine <SortIcon field="name" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Salt / Composition</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none" onClick={() => toggleSort('stock')}>
                  Stock <SortIcon field="stock" />
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none" onClick={() => toggleSort('expiry_date')}>
                  Expiry Status <SortIcon field="expiry_date" />
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((med) => {
                const expiryStatus = getExpiryStatus(med.expiry_date);
                const daysLeft = getDaysUntilExpiry(med.expiry_date);
                return (
                  <tr
                    key={med.id}
                    className={cn(
                      'transition-colors duration-150',
                      expiryStatus === 'critical' && 'bg-red-50/60 hover:bg-red-50',
                      expiryStatus === 'warning' && 'bg-amber-50/40 hover:bg-amber-50/70',
                      expiryStatus === 'normal' && 'hover:bg-gray-50/80',
                    )}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white',
                            expiryStatus === 'critical'
                              ? 'bg-gradient-to-br from-red-500 to-rose-500'
                              : expiryStatus === 'warning'
                                ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-500',
                          )}
                        >
                          {med.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{med.name}</div>
                          <div className="text-xs text-gray-400">ID: {med.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm text-gray-600">{med.salt}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <StockBadge stock={med.stock} reorderLevel={med.reorder_level} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <Badge status={expiryStatus}>
                        {daysLeft <= 0 ? 'Expired' : daysLeft + 'd remaining'}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <button
                        onClick={() => setSellTarget(med)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-md active:scale-95"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="text-gray-400">
              {(safePage - 1) * pageSize + 1}&ndash;{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage(1)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 text-xs font-semibold text-indigo-600">
              {safePage} / {totalPages}
            </span>
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage(totalPages)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      <SellModal
        open={sellTarget !== null}
        onClose={() => setSellTarget(null)}
        medicine={sellTarget}
      />
    </div>
  );
}



