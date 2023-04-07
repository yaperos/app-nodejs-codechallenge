import { IDomainEvent, UniqueEntityID } from 'clean-common-lib';

interface Response {
  id: string;
  isValid: boolean;
}

export class TransactionExternalResponseEvent implements IDomainEvent {
  public dateTimeOcurred: Date;
  public data: Response;

  constructor(data: Response) {
    this.dateTimeOcurred = new Date();
    this.data = data;
  }

  getAggregateId(): UniqueEntityID {
    throw new Error('Method not implemented.');
  }
}
