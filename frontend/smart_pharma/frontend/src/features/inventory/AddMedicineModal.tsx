import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAddMedicine } from '../../hooks/useAddMedicine';

interface AddMedicineModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  salt: string;
  stock: string;
  reorder_level: string;
  expiry_date: string;
  supplier_email: string;
}

interface FormErrors {
  name?: string;
  salt?: string;
  stock?: string;
  reorder_level?: string;
  expiry_date?: string;
  supplier_email?: string;
}

const initialForm: FormData = {
  name: '',
  salt: '',
  stock: '',
  reorder_level: '',
  expiry_date: '',
  supplier_email: '',
};

export function AddMedicineModal({ open, onClose }: AddMedicineModalProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const addMedicine = useAddMedicine();

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.salt.trim()) e.salt = 'Salt / composition is required';

    const stock = Number(form.stock);
    if (!form.stock || isNaN(stock) || stock < 0) e.stock = 'Stock must be ≥ 0';

    const reorder = Number(form.reorder_level);
    if (!form.reorder_level || isNaN(reorder) || reorder < 1)
      e.reorder_level = 'Reorder level must be ≥ 1';

    if (!form.expiry_date) {
      e.expiry_date = 'Expiry date is required';
    } else if (new Date(form.expiry_date) <= new Date()) {
      e.expiry_date = 'Expiry date must be in the future';
    }

    if (!form.supplier_email.trim()) {
      e.supplier_email = 'Supplier email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.supplier_email)) {
      e.supplier_email = 'Enter a valid email';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addMedicine.mutate(
      {
        name: form.name.trim(),
        salt: form.salt.trim(),
        stock: Number(form.stock),
        reorder_level: Number(form.reorder_level),
        expiry_date: form.expiry_date,
        supplier_email: form.supplier_email.trim(),
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          setErrors({});
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({});
    addMedicine.reset();
    onClose();
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add New Medicine">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Medicine Name"
          placeholder="e.g. Paracetamol 500mg"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
        />
        <Input
          label="Salt / Composition"
          placeholder="e.g. Acetaminophen"
          value={form.salt}
          onChange={(e) => update('salt', e.target.value)}
          error={errors.salt}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Stock Quantity"
            type="number"
            min={0}
            placeholder="0"
            value={form.stock}
            onChange={(e) => update('stock', e.target.value)}
            error={errors.stock}
          />
          <Input
            label="Reorder Level"
            type="number"
            min={1}
            placeholder="10"
            value={form.reorder_level}
            onChange={(e) => update('reorder_level', e.target.value)}
            error={errors.reorder_level}
          />
        </div>
        <Input
          label="Expiry Date"
          type="date"
          value={form.expiry_date}
          onChange={(e) => update('expiry_date', e.target.value)}
          error={errors.expiry_date}
        />
        <Input
          label="Supplier Email"
          type="email"
          placeholder="supplier@example.com"
          value={form.supplier_email}
          onChange={(e) => update('supplier_email', e.target.value)}
          error={errors.supplier_email}
        />

        {addMedicine.isError && (
          <p className="text-sm text-red-600">
            {addMedicine.error instanceof Error
              ? addMedicine.error.message
              : 'Failed to add medicine. Try again.'}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={addMedicine.isPending}>
            {addMedicine.isPending ? 'Adding...' : 'Add Medicine'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
