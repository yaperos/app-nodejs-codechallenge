import { Injectable } from '@nestjs/common';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class AntiFraudService {
  transactionMustBeApproved(data: Transaction) {
    if (data.value > 1000) return false;
    return true;
  }
}
