import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
} from '@nestjs-microservices/shared/dto';
import { Transaction } from '@nestjs-microservices/shared/entities';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly antifraudClient: ClientKafka
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    console.log('Creating transaction...');
    const transaction = await this.transactionsRepository.create(
      createTransactionDto
    );
    transaction.status = 'pending';
    const savedTransaction = await this.transactionsRepository.save(
      transaction
    );
    console.log('Emitting transaction.created event');
    this.antifraudClient.emit(
      'transaction.created',
      JSON.stringify(savedTransaction)
    );
  }

  async updateTransactionStatus(
    updateTransactionDto: UpdateTransactionStatusDto
  ) {
    console.log(`Updating transaction! ${updateTransactionDto.transactionId}`);
    const transaction = await this.transactionsRepository.findOneBy({
      id: updateTransactionDto.transactionId,
    });
    transaction.status = updateTransactionDto.transactionStatus;
    await this.transactionsRepository.save(transaction);
  }

  async getTransactionById(id: string) {
    const transaction = await this.transactionsRepository.findOneBy({ id });
    return instanceToPlain(transaction);
  }
}
