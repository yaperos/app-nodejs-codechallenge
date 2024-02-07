import { TransactionInfraRepository } from '../../shared/infrastructure/transaction.respository';
import { TransactionAntiFraudeUpdate } from '../app/transaction.update';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionAntiFraudeService extends TransactionAntiFraudeUpdate {
  constructor(repository: TransactionInfraRepository) {
    super(repository);
  }
}
