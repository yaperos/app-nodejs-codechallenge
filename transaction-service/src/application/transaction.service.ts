import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from 'src/domain/create-transaction.dto';
import { Repository } from 'typeorm';
import { Transaction } from '../domain/transaction.entity';

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
      'transaction',
      JSON.stringify({
        savedTransaction,
      }),
    );
    return savedTransaction;
  }

  private async getOne(id: number): Promise<Transaction> {
    const context = 'getOne';
    this.logger.log({
      context,
      status: 'start',
      payload: {
        id,
      },
    });
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
    });

    this.logger.log({
      context: 'getOne',
      status: 'end',
      id,
      payload: {
        transaction,
      },
    });
    return transaction;
  }
}
