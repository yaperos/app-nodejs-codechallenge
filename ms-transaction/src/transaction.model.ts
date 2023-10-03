import { Injectable } from '@nestjs/common';
import { TransactionServices } from '@src/transaction.services';

@Injectable()
export class TransactionModel {
  constructor(private transactionServices: TransactionServices) {}
  public transactions() {
    return [];
  }

  public transaction() {
    return [];
  }

  public createTransaction() {
    return {};
  }
}
