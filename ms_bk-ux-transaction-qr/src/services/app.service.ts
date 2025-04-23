import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/repositories/transaction.repository';

@Injectable()
export class AppService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async createTransaction(data: any) {
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

  async updateTransaction(id: string, data: any) {
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

    console.log('Transaction updated', response);
  }
}
