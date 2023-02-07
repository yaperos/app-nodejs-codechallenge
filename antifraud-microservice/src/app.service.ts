import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  validate(amount: number): string {
    const valid = amount > 1000 ? 'warning' : 'accepted';
    let transactionStatus = '';

    if (valid === 'warning') {
      transactionStatus = 'rejected';
    }

    if (valid === 'accepted') {
      transactionStatus = 'approved';
    }

    return transactionStatus;
  }
}
