import { Injectable } from '@nestjs/common';
import { AntiFraudResponse } from '../interfaces/anti-fraud-response';
import { Transaction } from '../interfaces/transaction';

@Injectable()
export class AntiFraudMsService {
  validateTransaction(message: Transaction): AntiFraudResponse {
    return {
      id: message.id,
      status: message.value > 1000 ? 'rejected' : 'approved',
    };
  }
}
