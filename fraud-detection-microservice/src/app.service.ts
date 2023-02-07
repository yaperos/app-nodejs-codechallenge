import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  validateTransactionValue(transactionValue: number): number {
    return transactionValue > 1000 ? 1 : 0;
  }
}
