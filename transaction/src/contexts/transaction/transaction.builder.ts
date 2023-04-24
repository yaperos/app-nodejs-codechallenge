import { Transaction } from '@/contexts/transaction/entities/transaction.entity';

export const transactionBuilder = (data: Transaction) => ({
  transactionExternalId: data.account_external_id_credit,
  transactionType: {
    name: data.transaction_type
  },
  transactionStatus: {
    name: data.transaction_status
  },
  value: data.value,
  createdAt: data.created_at,
  updatedAt: data.updated_at
})
