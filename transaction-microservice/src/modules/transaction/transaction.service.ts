import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  TransactionEntity,
  TransactionType,
  TransactionStatus,
} from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  @InjectRepository(TransactionEntity)
  private readonly repository: Repository<TransactionEntity>;

  constructor(
    @Inject('FRAUD_DETECTION_MICROSERVICE')
    private readonly fraudDetectionClient: ClientKafka,
  ) {}

  async create(data: CreateTransactionDto) {
    const transaction: TransactionEntity = new TransactionEntity();
    transaction.accountExternalIdCredit = data.accountExternalIdCredit;
    transaction.accountExternalIdDebit = data.accountExternalIdDebit;
    transaction.value = data.value;
    transaction.transactionType =
      Object.values(TransactionType)[data.transactionTypeId];
    await this.repository.save(transaction);
    this.fraudDetectionClient
      .send('detect_fraud', transaction.value)
      .subscribe((result) => {
        transaction.transactionStatus = Number(result)
          ? TransactionStatus.REJECTED
          : TransactionStatus.APPROVED;
        this.repository.save(transaction);
      });
  }

  async findOne(transactionExternalId: string) {
    return this.repository
      .findOneByOrFail({
        transactionExternalId,
      })
      .then((transaction) => JSON.stringify(transaction.toJSON()));
  }

  async onModuleInit() {
    this.fraudDetectionClient.subscribeToResponseOf('detect_fraud');
  }
}
