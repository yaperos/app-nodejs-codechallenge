import { ObjectType } from '@nestjs/graphql';
import { PaginatedOutputBase } from 'src/Shared/adapters/base/PaginatedOutputBase';
import { Transaction } from 'src/modules/transaction/infrastructure/persistence/TransactionPrismaModel';

@ObjectType()
export class PaginatedTransactionsOutput extends PaginatedOutputBase(
  Transaction,
) {}
