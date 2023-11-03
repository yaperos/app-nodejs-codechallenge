import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';
import { TransactionServiceInterface } from 'src/transaction/domain/interfaces/transaction.service.interface';

@Injectable()
export class TransactionServiceImpl implements TransactionServiceInterface {
  constructor(
    @Inject('TransactionRepository')
    private readonly repository: TransactionRepositoryInterface,
  ) {}

  async check(message: Transaction): Promise<boolean> {
    if (message.value <= 0 || message.value >= 1000) {
      return await this.repository.sendRejected(
        message.id,
        'El valor debe ser mayor a 0 y menor a 1000',
      );
    }
    return await this.repository.sendApproved(
      message.id,
      'El valor debe ser mayor a 0 y menor a 1000',
    );
  }
}
