import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { TransactionInput } from '../graphql/types';
import { TransactionStatus } from '../constants/enums';
import { Transaction } from '../entities/Transaction.entity';
import { KafkaService } from '../../kafka/services/kafka.service';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private createTransactionEvent: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    this.createTransactionEvent = this.configService.get(
      'TRANSACTION_CREATE_EVENT',
    );
  }

  async findOneById(id: string): Promise<Transaction> {
    const cachedTransaction: string = await this.cacheManager.get(id);

    if (cachedTransaction) {
      return plainToInstance(Transaction, JSON.parse(cachedTransaction));
    }
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['transactionStatus', 'transferType'],
    });

    await this.cacheManager.set(id, JSON.stringify(transaction));

    return transaction;
  }

  async createTransaction(transaction: TransactionInput): Promise<Transaction> {
    const newTransaction = plainToInstance(Transaction, {
      ...transaction,
      transactionStatusId: TransactionStatus.PENDING,
    });
    const savedTransaction = await this.transactionRepository.save(
      newTransaction,
    );

    this.logger.log(
      `Emiting transaction create event for transaction ID ${savedTransaction.id}`,
    );
    this.kafkaService.emitEvent(
      this.createTransactionEvent,
      JSON.stringify(savedTransaction),
    );

    return this.findOneById(savedTransaction.id);
  }

  async updateTransactionStatus(id: string, status: TransactionStatus) {
    this.logger.log(
      `Updating transaction status for transaction ID ${id} to ${TransactionStatus[status]}`,
    );
    await this.transactionRepository.update(
      { id },
      { transactionStatusId: status },
    );
    await this.cacheManager.del(id);
  }
}
