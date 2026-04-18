import { useQuery } from '@tanstack/react-query';
import { medicineApi } from '../services/api';

export function useMedicines() {
  return useQuery({
    queryKey: ['medicines'],
    queryFn: medicineApi.getAll,
    staleTime: 30_000,
  });
}

export function useSearchMedicines(query: string) {
  return useQuery({
    queryKey: ['medicines', 'search', query],
    queryFn: () => medicineApi.search(query),
    enabled: query.length > 0,
    staleTime: 10_000,
  });
}
