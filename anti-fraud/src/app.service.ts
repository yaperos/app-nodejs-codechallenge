import { Injectable } from '@nestjs/common';
import { CreateTransactionEvent } from 'src/create-transaction.event';

@Injectable()
export class AppService {
  handleTrasactionCreated(data: CreateTransactionEvent) {
    console.log(data);
  }
}
