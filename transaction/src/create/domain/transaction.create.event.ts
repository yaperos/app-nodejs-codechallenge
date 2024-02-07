import { TransactionPrimitive } from 'src/shared/domain/transaction.model';

export interface TransactionCreateEventInput extends TransactionPrimitive {}

export interface TransactionCreateEvent {
  handle(input: TransactionCreateEventInput): Promise<boolean>;
}
