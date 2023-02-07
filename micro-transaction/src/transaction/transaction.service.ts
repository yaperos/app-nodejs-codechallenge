import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionRepository.createTransaction({
      ...createTransactionDto,
      transfer_status_id: 1,
    });
  }

  findOne(id: string) {
    return this.transactionRepository.getTransactionById(id);
  }

  async updateStatusTransaction(
    idTransaction: number,
    newStatusTransactionId: number,
  ) {
    await this.transactionRepository.updatedStatusOfTransaction(
      idTransaction,
      newStatusTransactionId,
    );
  }
}
