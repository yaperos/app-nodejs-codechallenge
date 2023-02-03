import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ShowTransactionDto } from './dto/show-transaction.dto';
import { LoggerService } from '../infraestructure/logger/logger.service';
@Injectable()
export class TransactionService {
  private context = 'TransactionService';
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject('YAPE_EVENT_BUS')
    private readonly eventClient: ClientKafka,
    private readonly logger: LoggerService,
  ) {}

  async add(transactionDto: CreateTransactionDto): Promise<Transaction> {
    const context = `${this.context}-add`;
    this.logger.log(context, 'start', {
      CreateTransactionDto: transactionDto,
    });

    const transaction = new Transaction();
    transaction.accountExternalIdDebit = transactionDto.accountExternalIdDebit;
    transaction.accountExternalIdCredit =
      transactionDto.accountExternalIdCredit;
    transaction.value = transactionDto.value;

    const savedTransaction = await this.transactionRepository.save(transaction);

    this.logger.log(context, 'end', {
      savedTransaction,
    });

    this.eventClient.emit(
      'validate-transaction',
      JSON.stringify(savedTransaction),
    );
    return savedTransaction;
  }

  async update(transaction: UpdateTransactionDto): Promise<void> {
    const context = `${this.context}-update`;

    this.logger.log(context, 'end', {
      UpdateTransactionDto: transaction,
    });

    const toUpdate = {
      transactionStatusId: transaction.statusId,
    };

    this.transactionRepository.update(
      transaction.transactionExternalId,
      toUpdate,
    );
  }

  async getOne(transactionExternalId: string): Promise<ShowTransactionDto> {
    const context = `${this.context}-getOne`;
    this.logger.log(context, 'start', {
      transactionExternalId,
    });
    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId,
      },
    });

    this.logger.log(context, 'end', {
      transaction,
    });
    return {
      transactionExternalId: transaction.transactionExternalId,
      tranferTypeId: transaction.tranferTypeId,
      transactionStatusId: transaction.transactionStatusId,
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
