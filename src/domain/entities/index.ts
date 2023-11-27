import { TransactionStatus } from './transaction-status.entity';
import { TransactionType } from './transaction-type.entity';
import { Transaction } from './transaction.entity';

const typeOrmEntities = [Transaction, TransactionType, TransactionStatus];

export const TypeOrmEntities = Object.freeze(typeOrmEntities);
