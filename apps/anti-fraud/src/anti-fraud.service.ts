import { Injectable } from '@nestjs/common';
import { fraudConfig } from '../../shared/config/fraud.config';
import { EvaluateTransactionDto } from './dto/evaluate-transaction.dto';

@Injectable()
export class AntiFraudService {

  evaluate(dto: EvaluateTransactionDto): string {
    if (dto.value > fraudConfig.evaluation.rejectionThreshold) {
      return 'rejected';
    }

    return 'approved';
  }
}
