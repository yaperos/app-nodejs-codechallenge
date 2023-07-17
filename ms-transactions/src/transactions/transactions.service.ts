import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { config } from 'dotenv';

import { Transaction } from './transactions.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FormattedTransaction } from './transactions.interface';

config();

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(process.env.KAFKA_NAME) private readonly client: ClientKafka
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    try {

      return await this.transactionRepository.find();

    } catch (error) {

      throw new BadRequestException('Invalid request');

    }
  }

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    try {

      const newTransaction = this.transactionRepository.create(createTransactionDto);
  
      const createdTransaction = await this.transactionRepository.save(newTransaction);

      this.client.emit(process.env.KAFKA_TRANSACTION_TOPIC, JSON.stringify(createdTransaction))
  
      return createdTransaction;

    } catch (error) {

      throw new BadRequestException('Invalid request');

    }
  }

  async getTransactionById(transactionExternalId: string): Promise<Transaction> {
    try {

      const transaction = await this.transactionRepository.findOne({ where: {transactionExternalId} });

      if (!transaction) {

        throw new NotFoundException('Transaction not found');

      }

      return transaction;

    } catch (error) {

      throw new BadRequestException('Invalid request');

    }
  }

  async updateTransaction(transactionExternalId: string, updateTransactionDto: UpdateTransactionDto,): Promise<Transaction> {
    try {

      const transaction = await this.getTransactionById(transactionExternalId);

      transaction.transactionStatus = updateTransactionDto.transactionStatus;

      return await this.transactionRepository.save(transaction);

    } catch (error) {

      throw new BadRequestException('Invalid request');

    }
  }

  async deleteTransaction(transactionExternalId: string): Promise<void> {
    try {

      const transaction = await this.getTransactionById(transactionExternalId);

      await this.transactionRepository.remove(transaction);

    } catch (error) {

      throw new BadRequestException('Invalid request');

    }
  }

  getFormattedTransaction(transaction: Transaction): FormattedTransaction {
    const formattedTransaction: FormattedTransaction = {

      transactionExternalId: transaction.transactionExternalId,

      transactionType: { name: transaction.transferTypeId},

      transactionStatus: { name: transaction.transactionStatus },

      value: transaction.value,

      createdAt: transaction.createdAt,
    };

    return formattedTransaction;
  }
}