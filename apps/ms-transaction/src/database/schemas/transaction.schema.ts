import { EntitySchema } from 'typeorm';
import { Transaction } from './../../entities/transaction.entity';

export const TransactionSchema = new EntitySchema<Transaction>({
  name: 'transactions',
  columns: {
    transactionExternalId: {
      name: 'transaction_external_id',
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    value: {
      type: 'int',
      nullable: false,
    },
    status: {
      type: 'varchar',
      length: 30,
      default: 'PENDING',
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp with time zone',
      updateDate: true,
    },
  },
  relations: {
    transactionType: {
      type: 'many-to-one',
      target: 'transaction_types',
    },
  },
});
