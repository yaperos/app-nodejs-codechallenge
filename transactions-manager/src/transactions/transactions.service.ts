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
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private kafkaService: KafkaService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      transactionStatus: { name: 'pending' },
    });

    const transactionDB = await this.transactionsRepository.save(transaction);
    this.kafkaService.sendMessage('transactions_created', {
      uuid: transactionDB.uuid,
      value: transaction.value,
    });

    return transactionDB;
  }

  async update(updateTransactionDto: UpdateTransactionDto): Promise<boolean> {
    const transaction = await this.findOne(updateTransactionDto.uuid);
    if (!transaction) {
      return false;
    }
    await this.transactionsRepository.update(
      transaction.uuid,
      updateTransactionDto,
    );
    return true;
  }

  findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  findOne(uuid: string): Promise<Transaction> {
    return this.transactionsRepository.findOneBy({ uuid });
  }
}
