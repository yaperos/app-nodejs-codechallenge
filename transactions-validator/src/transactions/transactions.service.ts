import { Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/validate-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor() {}

  async validateTransaction(
    validateTransactionDto: TransactionDto,
  ): Promise<boolean> {
    return validateTransactionDto.value <= 1000;
  }
}