import { useState } from 'react';
import type { Medicine } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSell } from '../../hooks/useSell';

interface SellFormProps {
  medicine: Medicine;
}

export function SellForm({ medicine }: SellFormProps) {
  const [quantity, setQuantity] = useState(1);
  const sell = useSell();

  const isDisabled =
    quantity <= 0 || quantity > medicine.stock || sell.isPending;

  const handleSell = () => {
    sell.mutate(
      { id: medicine.id, quantity },
      {
        onSuccess: () => setQuantity(1),
        onError: (error) => {
          alert(
            error instanceof Error
              ? error.message
              : 'Sale failed. Insufficient stock or server error.',
          );
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min={1}
        max={medicine.stock}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-20 text-center"
      />
      <Button onClick={handleSell} disabled={isDisabled}>
        {sell.isPending ? 'Selling...' : 'Sell'}
      </Button>
    </div>
  );
}
