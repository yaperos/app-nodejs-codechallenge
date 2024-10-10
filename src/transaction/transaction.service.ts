import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Kafka, Producer } from 'kafkajs';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionService {
  private kafkaProducer: Producer;

  constructor(@InjectRepository(Transaction) private transactionRepository: Repository<Transaction>) {
    const kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: ['localhost:9092'],
    });

    this.kafkaProducer = kafka.producer();
  }

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);

    await this.transactionRepository.save(transaction);

    await this.kafkaProducer.connect();

    await this.kafkaProducer.send({
      topic: 'transactions',
      messages: [{ value: JSON.stringify(transaction) }],
    });

    await this.kafkaProducer.disconnect();

    return transaction;
  }

  async getTransaction(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.transactionType,
      },
      transactionStatus: {
        name: transaction.transactionStatus,
      },
      value: transaction.value,
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
