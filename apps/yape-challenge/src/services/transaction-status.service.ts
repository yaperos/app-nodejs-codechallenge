import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityNotFoundError, Repository } from 'typeorm';
import { TransactionStatus } from '../entities';

@Injectable()
export class TransactionStatusService {
  constructor(
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
  ) {}

  async getAllTransactionStatus(): Promise<TransactionStatus[]> {
    return this.transactionStatusRepository.find();
  }

  async getTransactionStatus(id: number): Promise<TransactionStatus> {
    return this.transactionStatusRepository.findOne({ where: { id } });
  }

  async newTransactionStatus(body: {
    statusName: string;
  }): Promise<TransactionStatus> {
    const { statusName } = body;
    try {
      const newTransactionType = this.transactionStatusRepository.create({
        statusName,
      });

      return this.transactionStatusRepository.save(newTransactionType);
    } catch (err) {
      throw new Error(`Error when creating the transaction status: ${err}`);
    }
  }

  async updateStatusTransaction(id: number, statusName: string) {
    try {
      const statusFound = await this.transactionStatusRepository.findOne({
        where: { id },
      });

      this.transactionStatusRepository.merge(statusFound, {
        statusName,
      });

      return this.transactionStatusRepository.save(statusFound);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new Error(`Transacción con ID ${id} no encontrada`);
      }

      throw new Error(`Error updating data: ${error.message}`);
    }
  }

  async DeleteAllStatus(): Promise<void> {
    await this.transactionStatusRepository.clear();
  }
}
