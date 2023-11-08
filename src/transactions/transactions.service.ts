import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    if (transaction.value > 1000) {
      transaction.status = 'rejected';
    } else {
      transaction.status = 'pending';
      this.kafkaClient.emit('verify_transaction', transaction);
    }

    await this.transactionRepository.save(transaction);
    return transaction;
  }
  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }
  async findOne(id: string): Promise<Transaction> {
    return this.transactionRepository.findOneBy({ id });
  }
  async sendTransactionStatusUpdate(transaction: any) {
    const result = await this.kafkaClient.send(
      'transaction-status-update-topic',
      transaction,
    );
    return result;
  }
  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('transaction-status-update-topic');
    await this.kafkaClient.connect();
  }
  async updateStatus(
    id: string,
    status: 'approved' | 'rejected',
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    transaction.status = status;
    await this.transactionRepository.save(transaction);
    return transaction;
  }
}
