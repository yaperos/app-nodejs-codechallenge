import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async validateTransaction(transaction: any) {
    const { value } = transaction;
    if (value > 1000) {
      return { valid: false, message: 'Transaction value is too high' };
    }
    return { valid: true };
  }
}
