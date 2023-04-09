import { Injectable } from '@nestjs/common';
import { TransactionStatusEnum } from '../domain/enums/transaction-status.enum';

@Injectable()
export class AppService {
  validateTransaction(value: number): TransactionStatusEnum {
    return value <= 1000
      ? TransactionStatusEnum.APPROVED
      : TransactionStatusEnum.REJECTED;
  }
}
