import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus, TransactionStatusValues } from './entities/transaction-status.entity';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class TransactionsService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'transaction-create'
      }
    }
  })
  client: ClientKafka;

  constructor(
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) { }

  async create(createTransactionInput: CreateTransactionInput): Promise<Transaction> {
    const transaction = this.transactionRepository.create();
    transaction.accountExternalIdCredit = createTransactionInput.accountExternalIdCredit
    transaction.accountExternalIdDebit = createTransactionInput.accountExternalIdDebit
    transaction.value = createTransactionInput.value
    transaction.transactionStatusId = TransactionStatusValues.PENDING
    const transactionType = await this.transactionTypeRepository.findOneBy({ id: createTransactionInput.tranferTypeId })
    if (!transactionType) {
      throw new NotFoundException(`TransactionType #${createTransactionInput.tranferTypeId} not found`);
    }
    transaction.transactionType = transactionType
    const savedTransaction = await this.transactionRepository.save(transaction)
    this.client.emit(process.env.CREATED_TOPIC, JSON.stringify(savedTransaction))

    return savedTransaction
  }

  async approve(transaction: Transaction): Promise<Transaction> {
    transaction.transactionStatusId = TransactionStatusValues.APPROVED
    return this.update(transaction)
  }

  async reject(transaction: Transaction): Promise<Transaction> {
    transaction.transactionStatusId = TransactionStatusValues.REJECTED
    return this.update(transaction)
  }

  async findAll(): Promise<Array<Transaction>> {
    return await this.transactionRepository.find();
  }

  async findOne(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ transactionExternalId: transactionId });
    if (!transaction) {
      throw new NotFoundException(`Transaction #${transactionId} not found`);
    }
    return transaction;
  }

  async getTransactionType(transactionTypeId: number): Promise<TransactionType> {
    const transactionType = await this.transactionTypeRepository.findOneBy({ id: transactionTypeId });
    if (!transactionType) {
      throw new NotFoundException(`TransactionType #${transactionTypeId} not found`);
    }
    return transactionType;
  }

  async getTrasactionStatus(transactionStatusId: number): Promise<TransactionStatus> {
    const transactionStatus = await this.transactionStatusRepository.findOneBy({ id: transactionStatusId });
    if (!transactionStatus) {
      throw new NotFoundException(`TransactionStatus #${transactionStatusId} not found`);
    }
    return transactionStatus;
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const savedTransaction = await this.transactionRepository.preload(transaction)
    if (!savedTransaction) {
      throw new NotFoundException(`Transaction #${transaction.transactionExternalId} not found`);
    }
    return this.transactionRepository.save(savedTransaction);
  }
}