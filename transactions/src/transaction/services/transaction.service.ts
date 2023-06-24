import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { TransactionInput } from '../graphql/types';
import { TransactionStatus } from '../constants/enums';
import { Transaction } from '../entities/Transaction.entity';
import { KafkaService } from '../../kafka/services/kafka.service';
import { UpdateTransactionStatusMessage } from '../contracts/types';

@Injectable()
export class TransactionService {
  private transactionsTopic: string;
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    this.transactionsTopic = this.configService.get('TRANSACTIONS_TOPIC');
  }

  findOneById(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['transactionStatus', 'transferType'],
    });
  }

  async createTransaction(transaction: TransactionInput): Promise<Transaction> {
    const newTransaction = plainToInstance(Transaction, {
      ...transaction,
      transactionStatusId: TransactionStatus.PENDING,
    });
    const savedTransaction = await this.transactionRepository.save(
      newTransaction,
    );
    this.kafkaService.sendMessage(this.transactionsTopic, savedTransaction);
    return this.findOneById(savedTransaction.id);
  }

  async updateTransactionStatus(message: UpdateTransactionStatusMessage) {
    const status = message.approved
      ? TransactionStatus.APPROVED
      : TransactionStatus.REJECTED;
    this.transactionRepository.update(
      { id: message.id },
      { transactionStatusId: status },
    );
  }
}
