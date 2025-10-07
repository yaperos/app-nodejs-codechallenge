import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  constructor() {}

  isSuspicious(transaction: { value: number }): boolean {
    return transaction.value > 1000;
  }
}
