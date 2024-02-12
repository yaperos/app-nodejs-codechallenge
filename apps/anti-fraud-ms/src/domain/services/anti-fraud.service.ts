import { AntiFraudRepository } from '../repositories/anti-fraud.repository';
import { AntiFraud } from '../model/anti-fraud.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  constructor(/*private readonly antiFraudRepo: AntiFraudRepository*/) {}

  async checkTransaction(/*antiFraud: AntiFraud*/): Promise<void> {
    return;
  }
}
