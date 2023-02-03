import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ShowTransactionDto } from './dto/show-transaction.dto';

export enum IStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

@Injectable()
export class ValidateService {
  constructor(
    @Inject('YAPE_EVENT_BUS')
    private readonly eventClient: ClientKafka,
  ) { }


  validate(transaction: ShowTransactionDto): void {
    let status = IStatus.APPROVED;
    console.log(transaction.value);
    console.log(transaction.value > 1000);
    if (transaction.value > 1000) {
      status = IStatus.REJECTED;
    }
    this.eventClient.emit('update-transaction', {
      id: transaction.id,
      statusId: status,
    });
  }
}
