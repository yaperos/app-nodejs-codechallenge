import { Injectable } from '@nestjs/common';
import { ShowTransactionDto } from './dto/show-transaction.dto';

export enum IStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

@Injectable()
export class ValidateService {
  validate(transaction: ShowTransactionDto): IStatus {
    console.log(transaction.value);
    console.log(transaction.value > 1000);
    if (transaction.value > 1000) {
      return IStatus.REJECTED;
    }
    return IStatus.APPROVED;
  }
}
