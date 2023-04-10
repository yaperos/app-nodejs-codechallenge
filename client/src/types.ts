export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export interface TransactionStatus {
  name: 'pending' | 'approved'| 'rejected';
}

export interface Transaction {
  id?: string;
  value: number;
  contact?: Contact;
  transactionStatus?: TransactionStatus;
  createdAt?: string;
}
