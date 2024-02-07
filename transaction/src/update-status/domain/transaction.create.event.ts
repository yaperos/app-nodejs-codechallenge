import { Transaction } from 'src/shared/domain/transaction.model';

export interface TransactionCreateEventInput extends Transaction {}

export interface TransactionCreateEvent {
  handle(input: TransactionCreateEventInput): Promise<boolean>;
}
