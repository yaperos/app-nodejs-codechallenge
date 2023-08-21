import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionTypeEntity } from '../../core/entity/transaction-type.entity';
import { In, Repository } from 'typeorm';
import { TransactionStateEntity } from '../../core/entity/transaction-state.entity';
import * as DataLoader from 'dataloader';
import { TransactionTypePresenter } from '../resolver/transaction/transaction-type.presenter';
import { TransactionStatePresenter } from '../resolver/transaction/transaction-state.presenter';

@Injectable()
export class DataLoaderService {

  private readonly transactionTypeLoader: DataLoader<number, TransactionTypePresenter>;
  private readonly transactionStateLoader: DataLoader<number, TransactionStatePresenter>;

  constructor(@InjectRepository(TransactionTypeEntity) private readonly transactionTypeRepository: Repository<TransactionTypeEntity>,
    @InjectRepository(TransactionStateEntity) private readonly transactionStateRepository: Repository<TransactionStateEntity>) {
    this.transactionTypeLoader = new DataLoader<number, TransactionTypeEntity>(this.buildTransactionTypeLoader.bind(this));
    this.transactionStateLoader = new DataLoader<number, TransactionStatePresenter>(this.buildTransactionStateLoader.bind(this));
  }

  private async buildTransactionTypeLoader(transactionTypeIds: number[]): Promise<TransactionTypePresenter[]> {
    const transactionTypes = await this.transactionTypeRepository.findBy({ id: In(transactionTypeIds) });
    const transactionTypeMap: { [key: number]: TransactionTypePresenter } = {};
    transactionTypes.forEach((transactionType) => {
      transactionTypeMap[transactionType.id] = TransactionTypePresenter.parseToPresenter(transactionType);
    });

    return transactionTypeIds.map((id) => transactionTypeMap[id]);
  }

  public async getTransactionType(TransactionTypeId: number): Promise<TransactionTypePresenter> {
    return this.transactionTypeLoader.load(TransactionTypeId);
  }

  private async buildTransactionStateLoader(transactionStateIds: number[]): Promise<TransactionStatePresenter[]> {
    const transactionStates = await this.transactionStateRepository.findBy({id: In(transactionStateIds)});
    const transactionStateMap: {[key: number]: TransactionStatePresenter} = {};

    transactionStates.forEach((transactionState) => {
      transactionStateMap[transactionState.id] = TransactionStatePresenter.parseToPresenter(transactionState);
    });

    return transactionStateIds.map((id) => transactionStateMap[id]);
  }

  public async getTransactionState(TransactionStateId: number): Promise<TransactionStatePresenter> {
    return this.transactionStateLoader.load(TransactionStateId);
  }

}