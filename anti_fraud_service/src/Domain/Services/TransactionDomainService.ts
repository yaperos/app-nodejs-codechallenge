import { Inject } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { TransactionInterfaceRepository } from '../Repository';
import { GetTransaction, UpdateTransaction } from '../Entitys';

export class TransactionDomainService {
  constructor(
    @Inject('TransactionInterfaceRepository')
    private readonly transactionInterfaceRepository: TransactionInterfaceRepository,
  ) {}

  async getTransaction(idTransaction: string): Promise<GetTransaction> {
    return this.transactionInterfaceRepository.getTransaction(idTransaction);
  }
  async updateTransaction(
    idTransaction: string,
    status: string,
  ): Promise<UpdateTransaction> {
    return this.transactionInterfaceRepository.updateTransaction(
      idTransaction,
      status,
    );
  }
}
