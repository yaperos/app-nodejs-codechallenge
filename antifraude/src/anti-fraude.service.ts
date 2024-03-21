import { Injectable } from '@nestjs/common';
import { TransactionStatusCodeEnum, ValidateTransaction } from './types';

@Injectable()
export class AntiFraudeService {
  validateTransaction(payload: ValidateTransaction): number {   
    return payload.value <= 1000 ? TransactionStatusCodeEnum.APPROVED : TransactionStatusCodeEnum.REJECTED;
  }
}