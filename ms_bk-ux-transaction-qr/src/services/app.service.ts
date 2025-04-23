import { Injectable, Logger } from '@nestjs/common';
import { TransactionCreatedRequestDto } from 'src/dtos/transaction-created-request.dto';
import { TransactionRepository } from 'src/repositories/transaction.repository';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly transactionRepository: TransactionRepository) {}

  async createTransaction(data: TransactionCreatedRequestDto) {
    const transaction = await this.transactionRepository.create({
      externalId: data.id,
      typeName: data.transferType.name,
      statusName: data.status.name,
      value: data.value,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
    return transaction;
  }

  async updateTransaction(id: string, data: TransactionCreatedRequestDto) {
    const transaction = await this.transactionRepository.findByExternalId(id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const response = await this.transactionRepository.update(id, {
      externalId: data.id,
      typeName: data.transferType.name,
      statusName: data.status.name,
      value: data.value,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });

    this.logger.log('Transaction updated', response);
  }
}
