import { Injectable } from '@nestjs/common';
import { TransactionEvent } from 'src/transactionEvent';

@Injectable()
export class AppService {
  handleTrasactionCreated(data: TransactionEvent) {
    console.log(data);
  }
}