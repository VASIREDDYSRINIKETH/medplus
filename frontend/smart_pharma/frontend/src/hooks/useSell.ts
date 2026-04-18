import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicineApi } from '../services/api';

export function useSell() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      medicineApi.sell(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}
