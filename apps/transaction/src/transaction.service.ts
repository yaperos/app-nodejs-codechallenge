import { BadRequestException, Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CacheService } from '../../shared/cache/cache.service';
import { kafkaConfig } from '../../shared/config/kafka.config';
import { KafkaEvaluationResponse, KafkaTransactionPayload, TransactionData } from '../../shared/types/transaction.types';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from './prisma.service';


@Injectable()
export class TransactionService implements OnModuleInit {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) { }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(kafkaConfig.topics.TRANSACTION_CREATED);
  }

  async create(dto: CreateTransactionDto) {
    await this.validateTransactionType(dto.transferTypeId);
    const pendingStatus = await this.getPendingStatus();
    const transaction = await this.createTransaction(dto, pendingStatus.id);

    this.logger.log(`Transaction created: ${JSON.stringify(transaction)}`);
    await this.publishTransactionToKafka(transaction);

    return { transactionId: transaction.id };
  }

  private async validateTransactionType(transferTypeId: number): Promise<void> {
    const cacheKey = CacheService.generateKey(CacheService.KEYS.TRANSACTION_TYPE, transferTypeId);

    const transactionType = await this.cacheService.getOrSet(
      cacheKey,
      async () => {
        this.logger.debug(`Fetching TransactionType ${transferTypeId} from DB`);
        return await this.prisma.transactionType.findUnique({
          where: { id: transferTypeId },
        });
      },
      CacheService.TTL.CATALOG
    );

    if (!transactionType) {
      throw new NotFoundException('Transaction type not found');
    }
  }

  private async getPendingStatus() {
    const cacheKey = CacheService.generateKey(CacheService.KEYS.TRANSACTION_STATUS, 'pending');

    const pendingStatus = await this.cacheService.getOrSet(
      cacheKey,
      async () => {
        this.logger.debug('Fetching pending status from DB');
        return await this.prisma.transactionStatus.findUnique({
          where: { name: 'pending' },
        });
      },
      CacheService.TTL.CATALOG
    );

    if (!pendingStatus) {
      throw new NotFoundException('Transaction status "pending" not found');
    }

    return pendingStatus;
  }

  private async createTransaction(dto: CreateTransactionDto, statusId: number): Promise<TransactionData> {
    return await this.prisma.transaction.create({
      data: {
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        transferTypeId: dto.transferTypeId,
        value: dto.value,
        transactionStatusId: statusId,
      },
    });
  }

  private async publishTransactionToKafka(transaction: TransactionData): Promise<void> {
    const fraudCheckPayload: KafkaTransactionPayload = {
      transactionId: transaction.id,
      value: transaction.value
    };

    this.logger.log('Sending message to Kafka:', fraudCheckPayload);

    try {
      const resp: KafkaEvaluationResponse = await lastValueFrom(
        this.kafkaClient.send(
          kafkaConfig.topics.TRANSACTION_CREATED,
          JSON.stringify(fraudCheckPayload)
        )
      );
      this.logger.log('Kafka message sent successfully:', resp);
      await this.updateTransactionStatus(resp.transactionId, resp.status);
    } catch (error) {
      this.logger.error('Error sending Kafka message:', error);
      throw new BadRequestException('Failed to publish transaction for evaluation');
    }
  }


  private async updateTransactionStatus(transactionId: string, statusName: string): Promise<void> {
    const statusRecord = await this.prisma.transactionStatus.findUnique({
      where: { name: statusName },
    });

    if (statusRecord) {
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { transactionStatusId: statusRecord.id },
      });
    }
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return {
      id: transaction.id,
      transactionExternalId: transaction.id,
      transactionType: { name: transaction.transactionType.name },
      transactionStatus: { name: transaction.transactionStatus.name },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

}
