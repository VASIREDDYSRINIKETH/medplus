export interface Medicine {
  id: number;
  name: string;
  salt: string;
  stock: number;
  reorder_level: number;
  expiry_date: string;
  supplier_email: string;
}

export interface SellPayload {
  quantity: number;
}
