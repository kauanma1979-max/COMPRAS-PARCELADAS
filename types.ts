
export interface Amortization {
  id: string;
  amount: number;
  date: string;
}

export interface Purchase {
  id: string;
  name: string;
  totalValue: number;
  installments: number;
  startDate: string;
  amortizations: Amortization[];
  receiptUrl?: string; // New field for Google Drive link
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
