import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  verification(transactionData) {
    return transactionData;
  }
}
