import { StatusTransactions } from '../enums/status.enum';
import { ValueObject } from './base/value-object';

export class Status extends ValueObject<StatusTransactions> {
  constructor(value: StatusTransactions) {
    super(value);
  }
}
