import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '../model/transaction.model';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Status } from '@app/common/constants/constants';
import { Token } from '../../infrastructure/constants';
import { TransactionTypeService } from './transaction-type.service';

export class TransactionService {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    @Inject(Token.TRANSACTION_TYPE)
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  async getOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findById(id);

    if (!transaction) {
      throw new NotFoundException();
    }
    return transaction;
  }

  async create(transactionData: Transaction): Promise<Transaction> {
    transactionData.status = Status.PENDING;

    try {
      await this.transactionTypeService.findOne(
        transactionData.transactionTypeId,
      );
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new BadRequestException(
          `Transaction type ${transactionData.transactionTypeId} is invalid`,
        );
      }
      throw e;
    }

    return await this.transactionRepo.save(transactionData);
  }
}
