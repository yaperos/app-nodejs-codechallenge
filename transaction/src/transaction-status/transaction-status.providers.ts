import { DataSource } from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';

export const transactionStatusProviders = [
  {
    provide: 'TRANSACTION_STATUS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TransactionStatus),
    inject: ['DATA_SOURCE'],
  },
];