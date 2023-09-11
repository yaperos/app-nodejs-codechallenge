import { ObjectId } from 'mongodb';

import { Logger } from '../../common/types';
import { TransactionStatus } from '../repositories/domain/transaction.domain';
import { TransactionRepository } from '../repositories/transaction.repository';

export interface TransactionUpdateStatusCommandInput {
  status: TransactionStatus;
}

export class TransactionUpdateStatus {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly logger: Logger,
  ) {}

  async handle(id: ObjectId, input: TransactionUpdateStatusCommandInput) {
    this.logger.debug(`Trying to update transaction for ${id}`);

    await this.transactionRepository.updateStatus(id, input.status);

    this.logger.debug(`Transaction has been update to: ${id}-${input.status}`);
  }
}
