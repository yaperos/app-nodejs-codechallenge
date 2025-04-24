import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ANTIFRAUD_KAFKA_CLIENT, KAFKA_TOPIC_TRANSACTION_VALIDATED } from 'src/shared/constants';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { GetTransactionDto } from '../dto/get-transaction.dto';
import { hasRequiredKeys } from 'src/utils/type-guards';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);
  private readonly threshold: number;
  private readonly transactionValidatedTopic: string;

  constructor(
    @Inject(ANTIFRAUD_KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) {
    this.threshold = this.configService.get<number>('app.antifraudThreshold', 1000);
    this.transactionValidatedTopic = KAFKA_TOPIC_TRANSACTION_VALIDATED
  }

  async validateAndPublish(transactionExternalId: string, value: number): Promise<void> {
    let status: 'approved' | 'rejected';

    if (value > this.threshold) {
      status = 'rejected';
      this.logger.log(`Transaction ${transactionExternalId} REJECTED (Value: ${value})`);
    } else {
      status = 'approved';
      this.logger.log(`Transaction ${transactionExternalId} APPROVED (Value: ${value})`);
    }

    const resultPayload = { transactionExternalId, status };

    try {
      this.kafkaClient.emit(this.transactionValidatedTopic, JSON.stringify(resultPayload));

      this.logger.log(`Published validation result for ${transactionExternalId}: ${status}`);
    } catch (error) {
      this.logger.error(`Failed to publish validation result for ${transactionExternalId}: ${error.message}`, error.stack);
      // Retry / Error handling
      throw error;
    }
  }

  async updateCache(
    transactionExternalId: string,
    partialData: Partial<GetTransactionDto>,
  ): Promise<void> {
    const cacheKey = `PK-${transactionExternalId}`;
    this.logger.debug(`Attempting cache update for ${cacheKey} with data: ${JSON.stringify(partialData)}`);

    try {
      const existingCachedData = await this.cacheManager.get<GetTransactionDto>(cacheKey);

      if (!existingCachedData) {
        this.logger.log(`No existing cache data found for ${transactionExternalId}, creating new entry.`);
        await this.cacheManager.set(cacheKey, partialData, 3600);
        return;
      }

      this.logger.log(`Existing cache data found for ${transactionExternalId}, merging with new data.`);

      let mergedData: GetTransactionDto

      const isFullData = hasRequiredKeys<GetTransactionDto>(partialData, GetTransactionDto.arguments)

      if (isFullData) {
        this.logger.log(`Full data received for ${transactionExternalId}, updating cache.`);

        mergedData = {
          ...existingCachedData,
          ...partialData,
        }

        await this.cacheManager.set(cacheKey, mergedData, 3600);
        return;
      }

      this.logger.log(`Partial data received for ${transactionExternalId}, updating cache.`);

      mergedData = {
        ...existingCachedData,
        ...partialData,
      }

      await this.cacheManager.set(cacheKey, mergedData, 3600);
      this.logger.log(`Cache updated for ${transactionExternalId}`);

    } catch (error) {
      this.logger.error(`Failed to update cache for ${transactionExternalId}: ${error.message}`, error.stack);
    }
  }

  async onModuleInit() {
    try { await this.kafkaClient.connect(); } catch (e) { this.logger.error('ANTIFRAUD Kafka Client connect error', e) }
  }
  async onModuleDestroy() {
    await this.kafkaClient.close();
  }
}