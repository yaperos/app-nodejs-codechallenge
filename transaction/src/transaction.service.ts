import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

import { PaginatorDto } from './dto/paginator.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { Transaction } from './entity/transaction.entity';
import { STATUS_TRANSACTION } from './constants/transaction-status.enum';
import { TOPIC_VALIDATION } from './constants/topic-validation.enum';
import { TransactionValidateDto } from './dto/transaction-validate.dto';
import { ERROR_MESSAGE_TRANSACTION_NOT_FOUND } from './constants/app.constants';
import { TYPE_TRANSACTION } from './constants/transaction-type.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @Inject(process.env.KAFKA_NAME_MODULE || 'kafka')
    private readonly kafkaService: ClientProxy,
  ) {}

  public async findAll(
    paginator: PaginatorDto,
  ): Promise<[Transaction[], number]> {
    const [listTransactions, total] =
      await this.transactionRepository.findAndCount({
        skip: paginator.page * paginator.size,
        take: paginator.size,
      });
    return [listTransactions, total];
  }

  async create(
    transactionCreatePayload: TransactionCreateDto,
  ): Promise<Transaction> {
    const transactionCreated = await this.transactionRepository.save({
      accountExternalIdDebit: transactionCreatePayload.accountExternalIdCredit,
      accountExternalIdCredit: transactionCreatePayload.accountExternalIdCredit,
      transferTypeId: transactionCreatePayload.tranferTypeId,
      value: transactionCreatePayload.value,
      transactionType: TYPE_TRANSACTION.NATIONAL_TRANSFER,
      transactionStatus: STATUS_TRANSACTION.PENDING,
    });

    this.kafkaService.emit(
      TOPIC_VALIDATION.TRANSACTION_CREATED,
      JSON.stringify(
        new TransactionValidateDto(
          transactionCreated.id,
          transactionCreated.value,
        ),
      ),
    );

    return transactionCreated;
  }

  async findById(id: number): Promise<Transaction> {
    const currentTransaction = await this.transactionRepository.findOne({
      where: { id: id },
    });

    if (!currentTransaction) {
      throw new HttpException(
        ERROR_MESSAGE_TRANSACTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return currentTransaction;
  }

  async transactionApproved(
    transactionValidate: TransactionValidateDto,
  ): Promise<Transaction> {
    const currentTransaction = await this.findById(transactionValidate.id);

    currentTransaction.transactionStatus = STATUS_TRANSACTION.APPROVED;
    return this.transactionRepository.save(currentTransaction);
  }

  async transactionRejected(
    transactionValidate: TransactionValidateDto,
  ): Promise<Transaction> {
    const currentTransaction = await this.findById(transactionValidate.id);

    currentTransaction.transactionStatus = STATUS_TRANSACTION.REJECTED;
    return this.transactionRepository.save(currentTransaction);
  }
}
