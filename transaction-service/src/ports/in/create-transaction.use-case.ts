import { CreateTransactionCommand } from '@application/commands/create-transaction.command';
import { Transaction } from '@domain/transaction';

export interface CreateTransactionUseCase {
  execute(command: CreateTransactionCommand): Promise<Transaction>;
}
