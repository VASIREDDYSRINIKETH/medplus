import type { Medicine, SellPayload } from '../types';

// ─── Dummy Data ───────────────────────────────────────────────
// This file replaces real API calls with in-memory dummy data.
// When the backend is ready, simply delete this file and
// restore the imports in hooks to use '../services/api'.

const today = new Date();
function daysFromNow(days: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

let medicines: Medicine[] = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    salt: 'Acetaminophen',
    stock: 120,
    reorder_level: 30,
    expiry_date: daysFromNow(15),
    supplier_email: 'supplier1@pharma.com',
  },
  {
    id: 2,
    name: 'Amoxicillin 250mg',
    salt: 'Amoxicillin Trihydrate',
    stock: 45,
    reorder_level: 20,
    expiry_date: daysFromNow(60),
    supplier_email: 'supplier2@pharma.com',
  },
  {
    id: 3,
    name: 'Cetirizine 10mg',
    salt: 'Cetirizine HCl',
    stock: 200,
    reorder_level: 50,
    expiry_date: daysFromNow(180),
    supplier_email: 'supplier3@pharma.com',
  },
  {
    id: 4,
    name: 'Metformin 500mg',
    salt: 'Metformin HCl',
    stock: 80,
    reorder_level: 25,
    expiry_date: daysFromNow(10),
    supplier_email: 'supplier4@pharma.com',
  },
  {
    id: 5,
    name: 'Azithromycin 500mg',
    salt: 'Azithromycin Dihydrate',
    stock: 30,
    reorder_level: 15,
    expiry_date: daysFromNow(75),
    supplier_email: 'supplier5@pharma.com',
  },
  {
    id: 6,
    name: 'Omeprazole 20mg',
    salt: 'Omeprazole',
    stock: 150,
    reorder_level: 40,
    expiry_date: daysFromNow(300),
    supplier_email: 'supplier6@pharma.com',
  },
  {
    id: 7,
    name: 'Ibuprofen 400mg',
    salt: 'Ibuprofen',
    stock: 10,
    reorder_level: 20,
    expiry_date: daysFromNow(5),
    supplier_email: 'supplier7@pharma.com',
  },
  {
    id: 8,
    name: 'Ciprofloxacin 500mg',
    salt: 'Ciprofloxacin HCl',
    stock: 65,
    reorder_level: 20,
    expiry_date: daysFromNow(45),
    supplier_email: 'supplier8@pharma.com',
  },
  {
    id: 9,
    name: 'Atorvastatin 10mg',
    salt: 'Atorvastatin Calcium',
    stock: 90,
    reorder_level: 30,
    expiry_date: daysFromNow(200),
    supplier_email: 'supplier9@pharma.com',
  },
  {
    id: 10,
    name: 'Losartan 50mg',
    salt: 'Losartan Potassium',
    stock: 55,
    reorder_level: 15,
    expiry_date: daysFromNow(25),
    supplier_email: 'supplier10@pharma.com',
  },
  {
    id: 11,
    name: 'Pantoprazole 40mg',
    salt: 'Pantoprazole Sodium',
    stock: 170,
    reorder_level: 40,
    expiry_date: daysFromNow(365),
    supplier_email: 'supplier11@pharma.com',
  },
  {
    id: 12,
    name: 'Dolo 650',
    salt: 'Paracetamol',
    stock: 5,
    reorder_level: 30,
    expiry_date: daysFromNow(-3),
    supplier_email: 'supplier12@pharma.com',
  },
];

// Simulate network delay
function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const mockMedicineApi = {
  getAll: async (): Promise<Medicine[]> => {
    await delay();
    return [...medicines];
  },

  create: async (medicine: Omit<Medicine, 'id'>): Promise<Medicine> => {
    await delay();
    const newMed: Medicine = {
      ...medicine,
      id: Math.max(...medicines.map((m) => m.id), 0) + 1,
    };
    medicines.push(newMed);
    return newMed;
  },

  sell: async (id: number, payload: SellPayload): Promise<Medicine> => {
    await delay();
    const med = medicines.find((m) => m.id === id);
    if (!med) throw new Error('Medicine not found');
    if (payload.quantity > med.stock) throw new Error('Insufficient stock');
    med.stock -= payload.quantity;
    return { ...med };
  },

  search: async (query: string): Promise<Medicine[]> => {
    await delay(200);
    const q = query.toLowerCase();
    return medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.salt.toLowerCase().includes(q),
    );
  },
};
