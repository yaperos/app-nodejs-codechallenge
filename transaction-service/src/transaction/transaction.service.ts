import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from '../shared/dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly kafkaService: KafkaService,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = await this.transactionRepository.create(createTransactionDto);
    await this.transactionRepository.save(transaction);

    // Send transaction Created event
    // This is just a pseudocode, you should implement Kafka producer logic
    await this.kafkaService.sendMessage('transaction_created', transaction);

    return transaction;
  }

  async getTransactionById(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne(id);
  }
}