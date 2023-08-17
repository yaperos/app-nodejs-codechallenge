import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  transactionMustBeApproved(transactionValue: number) {
    if (transactionValue > 1000) return false;
    return true;
  }
}
