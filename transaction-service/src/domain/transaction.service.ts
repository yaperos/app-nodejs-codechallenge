import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject('YAPE_EVENT_BUS')
    private readonly eventClient: ClientKafka,
  ) { }

  async add(transactionDto: CreateTransactionDto): Promise<Transaction> {
    const context = 'add';
    this.logger.log({
      context,
      status: 'start',
      payload: {
        bodyParams: transactionDto,
      },
    });

    const transaction = new Transaction();
    transaction.accountExternalIdDebit = transactionDto.accountExternalIdDebit;
    transaction.accountExternalIdCredit =
      transactionDto.accountExternalIdCredit;
    transaction.value = transactionDto.value;

    const savedTransaction = await this.transactionRepository.save(transaction);
    this.logger.log({
      context,
      status: 'end',
      payload: {
        savedTransaction,
      },
    });

    this.eventClient.emit(
      'validate-transaction',
      JSON.stringify(savedTransaction),
    );
    return savedTransaction;
  }

  async update(transaction: UpdateTransactionDto): Promise<void> {
    console.log(transaction);
    const context = 'update';
    this.logger.log({
      context,
      status: 'start',
      payload: {
        transaction,
      },
    });

    const toUpdate = {
      transactionStatusId: transaction.statusId,
    };

    this.transactionRepository.update(
      transaction.transactionExternalId,
      toUpdate,
    );
  }

  async getOne(transactionExternalId: string): Promise<Transaction> {
    const context = 'getOne';
    this.logger.log({
      context,
      status: 'start',
      payload: {
        transactionExternalId,
      },
    });
    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId,
      },
    });

    this.logger.log({
      context: 'getOne',
      status: 'end',
      transactionExternalId,
      payload: {
        transaction,
      },
    });
    return transaction;
  }
}
