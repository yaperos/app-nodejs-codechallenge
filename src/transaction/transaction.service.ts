import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Kafka, Producer } from 'kafkajs';

// TODO: Move to a shared module
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
}
