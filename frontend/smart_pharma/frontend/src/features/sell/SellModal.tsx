import { useState } from 'react';
import type { Medicine } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSell } from '../../hooks/useSell';

interface SellModalProps {
  open: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

interface Receipt {
  medicineName: string;
  salt: string;
  quantitySold: number;
  previousStock: number;
  remainingStock: number;
  date: string;
  time: string;
}

export function SellModal({ open, onClose, medicine }: SellModalProps) {
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const sell = useSell();

  const handleSell = () => {
    if (!medicine) return;
    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      setError('Quantity must be at least 1');
      return;
    }
    if (qty > medicine.stock) {
      setError('Quantity exceeds available stock');
      return;
    }

    setError('');
    sell.mutate(
      { id: medicine.id, quantity: qty },
      {
        onSuccess: () => {
          const now = new Date();
          setReceipt({
            medicineName: medicine.name,
            salt: medicine.salt,
            quantitySold: qty,
            previousStock: medicine.stock,
            remainingStock: medicine.stock - qty,
            date: now.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            time: now.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        },
        onError: (err) => {
          setError(
            err instanceof Error ? err.message : 'Sale failed. Try again.',
          );
        },
      },
    );
  };

  const handleClose = () => {
    setQuantity('1');
    setError('');
    setReceipt(null);
    sell.reset();
    onClose();
  };

  if (!medicine) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={receipt ? 'Sale Receipt' : 'Sell Medicine'}
    >
      {receipt ? (
        /* ── Receipt Preview ── */
        <div className="space-y-4">
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                MedPlus Receipt
              </span>
              <span className="text-xs text-gray-400">
                {receipt.date} &middot; {receipt.time}
              </span>
            </div>

            <div className="space-y-3 divide-y divide-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Medicine</span>
                <span className="font-semibold text-gray-900">
                  {receipt.medicineName}
                </span>
              </div>
              <div className="flex justify-between pt-3 text-sm">
                <span className="text-gray-500">Salt</span>
                <span className="text-gray-700">{receipt.salt}</span>
              </div>
              <div className="flex justify-between pt-3 text-sm">
                <span className="text-gray-500">Qty Sold</span>
                <span className="font-bold text-indigo-600">
                  {receipt.quantitySold}
                </span>
              </div>
              <div className="flex justify-between pt-3 text-sm">
                <span className="text-gray-500">Previous Stock</span>
                <span className="text-gray-700">{receipt.previousStock}</span>
              </div>
              <div className="flex justify-between pt-3 text-sm">
                <span className="text-gray-500">Remaining Stock</span>
                <span className="font-bold text-gray-900">
                  {receipt.remainingStock}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-emerald-600">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-semibold">Sale Successful</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleClose}>Done</Button>
          </div>
        </div>
      ) : (
        /* ── Sell Form ── */
        <div className="space-y-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">
              {medicine.name}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{medicine.salt}</p>
            <p className="mt-2 text-xs text-gray-500">
              Available stock:{' '}
              <span className="font-bold text-gray-800">{medicine.stock}</span>
            </p>
          </div>

          <Input
            label="Quantity to sell"
            type="number"
            min={1}
            max={medicine.stock}
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError('');
            }}
            error={error}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSell} loading={sell.isPending}>
              {sell.isPending ? 'Processing...' : 'Confirm Sale'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
