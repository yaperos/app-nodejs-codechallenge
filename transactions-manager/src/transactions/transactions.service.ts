import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '../database/entities/transaction.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class TransactionsService {
  constructor(
    // Inject the Transaction repository
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    // Inject the Kafka service
    private kafkaService: KafkaService,
  ) {}

  // Create a new transaction
  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // Create a new transaction with 'pending' status
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      transactionStatus: { name: 'pending' },
    });

    // Save the transaction in the database
    const transactionDB = await this.transactionsRepository.save(transaction);
    // Send a message to Kafka with the created transaction
    this.kafkaService.sendMessage('transactions_created', {
      uuid: transactionDB.uuid,
      value: transaction.value,
    });

    // Return the saved transaction
    return transactionDB;
  }

  // Update an existing transaction
  async update(updateTransactionDto: UpdateTransactionDto): Promise<boolean> {
    // Find the transaction by its UUID
    const transaction = await this.findOne(updateTransactionDto.uuid);
    // If the transaction is not found, return false
    if (!transaction) {
      return false;
    }
    // Update the transaction in the database
    await this.transactionsRepository.update(
      transaction.uuid,
      updateTransactionDto,
    );
    // Return true to indicate that the update was successful
    return true;
  }

  // Return all transactions
  findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  // Find a transaction by its UUID
  findOne(uuid: string): Promise<Transaction> {
    return this.transactionsRepository.findOneBy({ uuid });
  }
}