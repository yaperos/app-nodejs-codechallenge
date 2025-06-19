import { Injectable } from '@nestjs/common';
import { EvaluateTransactionDto } from './dto/evaluate-transaction.dto';

@Injectable()
export class AntiFraudService {

  evaluate(dto: EvaluateTransactionDto): { transactionId: string, status: string } {
    if (dto.value > 1000) {
      return { transactionId: dto.transactionId, status: 'rejected' };
    }
    return { transactionId: dto.transactionId, status: 'approved' };
  }
}
