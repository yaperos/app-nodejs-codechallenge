import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudMsService {
  getHello(): string {
    return 'Hello World!';
  }

  analizeTransaction(transaction: any): any {
    if (transaction.value > 1000) {
      transaction.transactionStatusId = 3;
    } else {
      transaction.transactionStatusId = 2;
    }
    return JSON.stringify(transaction);
  }
}
