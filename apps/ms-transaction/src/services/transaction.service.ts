import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionDto, UpdateTransactionDto } from '../dto';
import { Transaction, TransactionStatus, TransactionType } from '../models';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
    @Inject('MS_ANTIFRAUD') private readonly clientAntifraud: ClientProxy,
  ) {}
  async save(data: CreateTransactionDto) {
    console.log('send queue transaction_create');
    const transaction: Transaction = await this.transactionRepository.create(
      data,
    );
    const transactionCreated = await this.transactionRepository.save(
      transaction,
    );
    console.log('emit transaction_created_event:', transactionCreated);

    this.clientAntifraud.emit('transaction_created_event', transactionCreated);
    return transactionCreated;
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find();
  }

  findOne(id: number): Promise<Transaction> {
    return this.transactionRepository.findOneOrFail({ where: { id } });
  }

  getTransactionsStatus(id: number): Promise<TransactionStatus> {
    return this.transactionStatusRepository.findOne({ where: { id } });
  }

  getTransactionsType(id: number): Promise<TransactionType> {
    return this.transactionTypeRepository.findOne({ where: { id } });
  }

  async update(data: UpdateTransactionDto) {
    console.log('data recibido en transactionService.update:', data);
    const transaction: Transaction = await this.transactionRepository.preload({
      ...data,
    });

    if (!transaction) {
      throw new NotFoundException('Resource not found');
    }

    return transaction;
  }
}
