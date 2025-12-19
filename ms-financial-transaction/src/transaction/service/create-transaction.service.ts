import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../entity/transaction';
import { randomUUID } from 'crypto';
import { TransactionPostgresRepository } from '../adapter/out/db/postgres/transaction-postgres.repository';
import { CreateTransactionInputDto } from '../dto/create-transaction-input.dto';
import { TransactionKafkaProducer } from '../adapter/out/messaging/kafka/transaction-kafka.producer';
import { TransactionStatus } from '../entity/transaction-status.enum';
import { TransactionType } from '../entity/transaction-type.enum';
import { Logger } from 'nestjs-pino';

@Injectable()
export class CreateTransactionService {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionDbRepo: TransactionPostgresRepository,
    private readonly transactionEventProducer: TransactionKafkaProducer,
    private readonly logger: Logger,
  ) {}

  async create(
    createTransactionInputDto: CreateTransactionInputDto,
  ): Promise<Transaction> {
    const transaction = new Transaction(
      randomUUID(),
      createTransactionInputDto.amount,
      createTransactionInputDto.accountExternalIdDebit,
      createTransactionInputDto.accountExternalIdCredit,
      createTransactionInputDto.transferType as TransactionType,
      new Date(),
      new Date(),
      TransactionStatus.PENDING,
    );
    await this.transactionDbRepo.save(transaction);
    this.logger.debug({ transactionId: transaction.id }, 'Transaction saved');
    await this.transactionEventProducer.produceTransactionCreatedEvent(
      transaction,
    );
    return transaction;
  }
}
