import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
export class AppService {
  @InjectRepository(TransactionEntity)
  private readonly repository: Repository<TransactionEntity>;

  constructor(
    @Inject('FRAUD_DETECTION_MICROSERVICE')
    private readonly fraudDetectionClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello Transaction MS!';
  }

  async create(data: CreateTransactionDto) {
    const transaction: TransactionEntity = new TransactionEntity();
    transaction.accountExternalIdCredit = data.accountExternalIdCredit;
    transaction.accountExternalIdDebit = data.accountExternalIdDebit;
    transaction.value = data.value;
    transaction.transactionType =
      Object.values(TransactionType)[data.transactionTypeId];
    await this.repository.save(transaction);
    this.fraudDetectionClient.emit('detect-fraud', {
      transactionId: transaction.transactionExternalId,
      transactionValue: transaction.value,
    });
    return JSON.stringify(transaction);
  }

  async findOne(transactionExternalId: string) {
    return this.repository
      .findOneBy({
        transactionExternalId,
      })
      .then((transaction) => JSON.stringify(transaction));
  }

  async findAll() {
    return this.repository
      .find({
        order: {
          createdAt: 'DESC',
        },
      })
      .then((transactions) => JSON.stringify(transactions));
  }

  async updateFraudStatus(transactionExternalId: string, isFraud: boolean) {
    const transaction = await this.repository.findOneBy({
      transactionExternalId,
    });
    if (!transaction) {
      console.error('Transaction not found.');
      return;
    }
    transaction.transactionStatus = isFraud
      ? TransactionStatus.REJECTED
      : TransactionStatus.APPROVED;
    await this.repository.save(transaction);
    console.log(
      `Transaction ${transaction.transactionExternalId} fraud status updated`,
    );
  }

  async onModuleInit() {
    this.fraudDetectionClient.subscribeToResponseOf('detect-fraud');
    await this.fraudDetectionClient.connect();
  }

  async onModuleDestroy() {
    await this.fraudDetectionClient.close();
  }
}
