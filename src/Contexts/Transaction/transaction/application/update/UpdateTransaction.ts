import { PublishEvent } from '../../../events/application/PublishEvent';
import { BaseUseCase } from '../../../../Shared/application/BaseUseCase';
import { ApplicationError } from '../../../../Shared/domain/ApplicationError';
import { WrongGuid } from '../../domain/errors/WrongGuid';
import { Transaction } from '../../domain/Transaction';
import { TransactionRepository } from '../../domain/TransactionRepository';

interface Request {
  transactionId: string;
  transactionStatus: number;
}

export class UpdateTransaction extends BaseUseCase<Request, Promise<any> | ApplicationError> {
  constructor(private readonly repository: TransactionRepository) {
    super();
  }
  public async run(data: Request): Promise<any> {
    const transaction = await this.repository.findById(data.transactionId)
    transaction.setStatus(data.transactionStatus)
    await this.repository.save(transaction);
  }
}
