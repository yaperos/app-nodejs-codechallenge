import { IEvent } from '@nestjs/cqrs';
import { TransactionEssentialProperties, STATUS_TYPE } from '../transaction';

export class TransactionOpenedEvent implements IEvent, TransactionEssentialProperties {
  readonly id: string;
  readonly transactionStatus: STATUS_TYPE;
  readonly value: number;
}
