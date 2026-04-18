import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Medicine } from '../types';
import { medicineApi } from '../services/api';

export function useAddMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicine: Omit<Medicine, 'id'>) => medicineApi.create(medicine),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}
