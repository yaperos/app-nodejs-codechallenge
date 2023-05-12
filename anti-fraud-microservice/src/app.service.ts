import { Injectable } from '@nestjs/common';
import { AntiFraudDecision, Transaction, TransactionStatus } from './dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  evaluateTransaction(transaction: Transaction): string {
    console.log(transaction);
    const status = new TransactionStatus();
    if (transaction.value > 1000) {
      status.name = 'rejected';
    } else {
      status.name = 'approved';
    }
    const antifraudDecision = new AntiFraudDecision();
    antifraudDecision.transactionExternalId = transaction.transactionExternalId;
    antifraudDecision.transactionStatus = status;
    console.log(antifraudDecision);
    return JSON.stringify(antifraudDecision);
  }
}
