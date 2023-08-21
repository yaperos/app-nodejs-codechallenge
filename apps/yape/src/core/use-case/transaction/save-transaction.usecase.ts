import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../../repository/transaction.repository';
import { TransactionDto } from 'apps/yape/src/infra/resolver/transaction/transaction.dto';
import { TransactionEntity } from '../../entity/transaction.entity';
import { TransactionPresenter } from 'apps/yape/src/infra/resolver/transaction/transaction.presenter';

@Injectable()
export class SaveTransactionUseCase {

  constructor(@Inject('TransactionRepository') private readonly transactionRepository: TransactionRepository) { }

  async insert(transactionDto: TransactionDto): Promise<TransactionPresenter> {
    const transaction = TransactionEntity.parseToCreate(transactionDto);
    const entity = await this.transactionRepository.insert(transaction);
    return TransactionPresenter.parseToPresenter(entity);
  }

  update(transaction: any) {
    this.transactionRepository.update(transaction);
  }

}