import { Injectable } from '@nestjs/common';
import { Transaction } from '@app-nodejs-codechallenge/shared/entities';

@Injectable()
export class AppService {
  evalueTransaction(transaction: Transaction) {
    return transaction.value >=1000 ? 'rejected' : 'approved';
  }
}
