import { useMemo } from 'react';
import { useMedicines } from './useMedicines';
import { getDaysUntilExpiry } from '../lib/utils';

export function useExpiry(thresholdDays = 90) {
  const query = useMedicines();

  const nearExpiry = useMemo(() => {
    if (!query.data) return [];
    return query.data
      .filter((m) => getDaysUntilExpiry(m.expiry_date) < thresholdDays)
      .sort(
        (a, b) =>
          getDaysUntilExpiry(a.expiry_date) - getDaysUntilExpiry(b.expiry_date),
      );
  }, [query.data, thresholdDays]);

  return {
    ...query,
    nearExpiry,
  };
}
