import { Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/validate-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor() {}

  // This method validates a transaction
  async validateTransaction(
    validateTransactionDto: TransactionDto,
  ): Promise<boolean> {
    // It checks if the transaction value is less than or equal to 1000
    // If it is, the transaction is considered valid and the method returns true
    // If not, the method returns false
    return validateTransactionDto.value <= 1000;
  }
}