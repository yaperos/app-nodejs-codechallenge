import { TransactionValidateEventProducer } from '../domain/transaction-validate.event';
import { TransactionCreatedEventInput } from '../domain/transaction.created.event';

export class TransactionValidate {
  constructor(private readonly broker: TransactionValidateEventProducer) {}

  async handle({ id, value }: TransactionCreatedEventInput) {
    const rejected = value > 1000;
    return this.broker.handle({ id, rejected });
  }
}
