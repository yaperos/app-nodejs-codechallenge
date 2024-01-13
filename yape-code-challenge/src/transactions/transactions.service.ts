import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { KafkaService } from 'src/kafka/kafka.service';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private kafkaService: KafkaService,
  ) {}

  async createTransaction(
    createDto: CreateTransactionDTO,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createDto,
    });

    await this.transactionRepository.save(transaction);

    this.kafkaService.emit('validate-transaction', {
      key: transaction.transactionExternalId,
      value: {
        ...createDto,
        transactionId: transaction.transactionExternalId,
      },
    });

    return transaction;
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }
}
