import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionService {
  private readonly logger: Logger = new Logger(TransactionService.name);
  private kafkaProducer: Producer;
  private kafkaConsumer: Consumer;

  constructor(@InjectRepository(Transaction) private transactionRepository: Repository<Transaction>) {
    const kafka = new Kafka({ clientId: process.env.KAFKA_CLIENT_ID, brokers: process.env.KAFKA_BROKERS.split(',') });

    this.kafkaProducer = kafka.producer();
    this.kafkaConsumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

    this.listenToAntiFraud();
  }

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = { ...createTransactionDto, transactionType: 'transfer', transactionStatus: 'pending' };

    this.logger.log('new transaction', newTransaction);

    const transaction = this.transactionRepository.create(newTransaction);

    await this.transactionRepository.save(transaction);

    await this.kafkaProducer.connect();

    await this.kafkaProducer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(transaction) }],
    });

    await this.kafkaProducer.disconnect();

    return transaction;
  }

  async listenToAntiFraud(): Promise<void> {
    await this.kafkaConsumer.connect();

    await this.kafkaConsumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

    await this.kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const { id, value, transactionStatus } = JSON.parse(message.value.toString());

        this.logger.log('current values', { id, value, transactionStatus });

        const newStatus = value > 1000 ? 'rejected' : 'approved';

        this.logger.log('new values', { id, value, transactionStatus: newStatus });

        await this.updateTransactionStatus(id, newStatus);
      },
    });
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<void> {
    this.logger.log('updating transaction values', { transactionId, status });

    const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });

    if (transaction) {
      transaction.transactionStatus = status;

      await this.transactionRepository.save(transaction);
    }
  }

  async getTransaction(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return {
      transactionExternalId: transaction.id,
      transactionType: { name: transaction.transactionType },
      transactionStatus: { name: transaction.transactionStatus },
      value: transaction.value,
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
