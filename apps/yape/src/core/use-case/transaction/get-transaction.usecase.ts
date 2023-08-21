import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../../repository/transaction.repository';
import { TransactionPresenter } from 'apps/yape/src/infra/resolver/transaction/transaction.presenter';

@Injectable()
export class GetTransactionUseCase {

  constructor(@Inject('TransactionRepository') private readonly transactionRepository: TransactionRepository) {}

  async getTransaction(transactionId: string): Promise<TransactionPresenter> {
    const transaction =  await this.transactionRepository.get(transactionId);
    return TransactionPresenter.parseToPresenter(transaction);
  }

}