import { Injectable } from '@nestjs/common';
import { CreateTransactionEvent } from './create.transaction.event';

@Injectable()
export class AppService {
  handleTrasactionCreated(data: CreateTransactionEvent) {
    const amount = data.amount;
    const transactionStatus = amount > 1000 ? 'rejected' : 'approved';
    const transactionStatusChanged = { ...data, transactionStatus }
    return transactionStatusChanged;
  }
}
