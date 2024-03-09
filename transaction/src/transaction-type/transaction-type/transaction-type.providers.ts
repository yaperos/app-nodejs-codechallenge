import { DataSource } from 'typeorm';
import { TransactionType } from './transaction-type.entity';

export const transactionTypeProviders = [
  {
    provide: 'TRANSACTION_TYPE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TransactionType),
    inject: ['DATA_SOURCE'],
  },
];