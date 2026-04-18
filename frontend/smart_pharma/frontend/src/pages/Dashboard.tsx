import { useState, useCallback, useMemo } from 'react';
import { useMedicines, useSearchMedicines } from '../hooks/useMedicines';
import { InventoryTable, AddMedicineModal } from '../features/inventory';
import { SearchBar } from '../features/search';
import { getDaysUntilExpiry } from '../lib/utils';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const allMedicines = useMedicines();
  const searchResults = useSearchMedicines(searchQuery);

  const isSearching = searchQuery.length > 0;
  const medicines = isSearching
    ? searchResults.data ?? []
    : allMedicines.data ?? [];
  const isLoading = isSearching ? searchResults.isLoading : allMedicines.isLoading;
  const isError = isSearching ? searchResults.isError : allMedicines.isError;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const stats = useMemo(() => {
    const data = allMedicines.data ?? [];
    const totalItems = data.length;
    const totalStock = data.reduce((sum, m) => sum + m.stock, 0);
    const lowStock = data.filter((m) => m.stock <= m.reorder_level).length;
    const nearExpiry = data.filter((m) => getDaysUntilExpiry(m.expiry_date) < 90).length;
    return { totalItems, totalStock, lowStock, nearExpiry };
  }, [allMedicines.data]);

  const statCards = [
    { label: 'Total Medicines', value: stats.totalItems, icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Total Stock Units', value: stats.totalStock.toLocaleString(), icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Low Stock Alerts', value: stats.lowStock, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Near Expiry', value: stats.nearExpiry, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-red-500 to-rose-500', bg: 'bg-red-50', text: 'text-red-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Inventory Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Real-time overview of your pharmacy stock, sales, and expiry tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar onSearch={handleSearch} />
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-md active:scale-95 whitespace-nowrap"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Medicine
          </button>
        </div>
      </div>

      {!isSearching && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <div key={card.label} className={`animate-slide-up stagger-${i + 1} group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}>
                  <svg className={`h-5 w-5 ${card.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${card.color} opacity-0 transition-opacity group-hover:opacity-100`} />
            </div>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
          <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm text-indigo-700">
            Showing results for "<span className="font-semibold">{searchQuery}</span>"
            {searchResults.data && <span className="text-indigo-500"> &mdash; {searchResults.data.length} found</span>}
          </p>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-red-800">
            Failed to load medicines. Please check your connection and try again.
          </p>
        </div>
      )}

      <InventoryTable medicines={medicines} isLoading={isLoading} />
      <AddMedicineModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
