import { KafkaConnection } from 'nestjs-kafkajs';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExternalTransactionDto } from './dto';
import { ExternalTransactionStatus } from './enums';
import {
  ExternalTransaction,
  ExternalTransactionDocument,
} from './external-transaction.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class ExternalTransactionsService {
  private readonly logger = new Logger(ExternalTransactionsService.name);

  constructor(
    private readonly kafkaConnection: KafkaConnection,
    @InjectModel(ExternalTransaction.name)
    private externalTransactionModel: Model<ExternalTransactionDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    dto: CreateExternalTransactionDto,
  ): Promise<ExternalTransaction> {
    const externalTransaction = await this.externalTransactionModel.create(dto);

    this.logger.debug('Transaction Created', externalTransaction);

    this.logger.debug('Emitting event "transaction.created"');

    await this.kafkaConnection.publish('transaction.created', {
      id: externalTransaction._id,
      amount: externalTransaction.value,
    });

    return externalTransaction;
  }

  async updateStatusById(
    id: string,
    status: ExternalTransactionStatus,
  ): Promise<void> {
    this.logger.debug(`Updating status from ${id} to ${status}`);

    await this.externalTransactionModel
      .updateOne({ _id: id }, { status })
      .exec();

    await this.cacheManager.del(`/external-transactions/${id}`);
  }

  findById(id: string): Promise<ExternalTransaction> {
    return this.externalTransactionModel
      .findById(id)
      .select({ _id: 1, status: 1, value: 1, createdAt: 1, transactionType: 1 })
      .lean()
      .exec();
  }
}
