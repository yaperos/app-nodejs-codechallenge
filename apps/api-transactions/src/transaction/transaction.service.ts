import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Repository } from 'typeorm';
import { TransactionType } from './entities/transactionType.entity';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionEvent } from './dto/event-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  findTransactionByUid(transactionExternalId: string): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: {
        transactionExternalId,
      },
    });
  }

  async createTransactions(
    transaction: CreateTransactionDto,
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(transaction);
    const transactionCreated = await this.transactionRepository.save(
      newTransaction,
    );

    this.kafkaClient.emit('transaction.created', {
      meta: {
        origin: 'api-transactions',
        date: new Date(),
      },
      data: {
        accountExternalIdCredit: transactionCreated.accountExternalIdCredit,
        accountExternalIdDebit: transactionCreated.accountExternalIdDebit,
        value: transactionCreated.value,
        transactionExternalId: transactionCreated.transactionExternalId,
      },
    } as TransactionEvent);

    return transactionCreated;
  }

  // NOTE: types
  getTransactionTypes(): Promise<TransactionType[]> {
    return this.transactionTypeRepository.find();
  }

  getTransactionTypeById(id: number): Promise<TransactionType> {
    return this.transactionTypeRepository.findOne({ where: { id } });
  }

  // NOTE: status
  getTransactionStatuses(): Promise<TransactionStatus[]> {
    return this.transactionStatusRepository.find();
  }

  getTransactionStatusById(id: number): Promise<TransactionStatus> {
    return this.transactionStatusRepository.findOne({ where: { id } });
  }
}
