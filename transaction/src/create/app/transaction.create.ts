import { TransactionCreateEvent as TransactionCreatedEvent } from '../domain/transaction.create.event';
import { TransactionRepository } from 'src/shared/domain/transaction.repository';
import { TransactionCreateInput } from './transaction.create.dto';
import { Transaction } from 'src/shared/domain/transaction.model';

export class TransactionCreate {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly broker: TransactionCreatedEvent,
  ) {}

  async handle(input: TransactionCreateInput) {
    const transaction = Transaction.build(input);
    await this.repository.create(transaction);
    await this.broker.handle(transaction.toPrimitives());
    return transaction;
  }
}
