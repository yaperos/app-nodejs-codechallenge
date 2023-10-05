import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Producer } from 'kafkajs';


@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository:Repository<Transaction>,
    @Inject('KAFKA_PRODUCER_FRAUD') private kafkaProducer: Producer
){}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionRepository.save({
      ...createTransactionDto,
      status: 'pending',
      createdAt: new Date(),
    })

    const key = Math.floor(Math.random() * 100);
    this.sendKafkaEvent(this.generateKey(), {
      ...transaction,
    });
  }

  private sendKafkaEvent(key, value) {
    this.kafkaProducer.send({
      topic: 'antifraud',
      messages: [{ key, value: JSON.stringify(value) }],
    });
  }

  private generateKey() {
    return Math.floor(Math.random() * 1000).toString();
  }

  /*
   The basis of the following operations is provided for possible future implementations
 */

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
