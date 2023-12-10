import { TransactionType } from './../../entities/transaction-type.entity';
import { EntitySchema } from 'typeorm';

export const TransactionTypeSchema = new EntitySchema<TransactionType>({
  name: 'transaction_types',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 60,
      nullable: false,
    },
  },
  uniques: [
    {
      name: 'UNIQUE_NAME_TRANSACTION_TYPE',
      columns: ['name'],
    },
  ],
});
