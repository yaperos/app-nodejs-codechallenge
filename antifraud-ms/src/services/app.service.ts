import { Injectable, Logger } from '@nestjs/common';
import { TransactionDto, TransactionStatus } from '../dtos/transaction.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  
  validateTransaction(transaction: TransactionDto) {
    const LIMIT_VALUE = Number(process.env.LIMIT_VALUE) || 1000;
    const { id, value } = transaction;
    
    this.logger.log(`TransactionID-> ${id}`);

    if (value < LIMIT_VALUE) {
      return { id, status: TransactionStatus.APPROVED };
    }
    return { id, status: TransactionStatus.REJECTED };
  }
}
