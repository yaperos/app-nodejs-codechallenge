import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ANTIFRAUD_KAFKA_CLIENT, KAFKA_TOPIC_TRANSACTION_VALIDATED } from 'src/shared/constants';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);
  private readonly threshold: number;
  private readonly transactionValidatedTopic: string;

  constructor(
    @Inject(ANTIFRAUD_KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,

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

  async onModuleInit() {
    try { await this.kafkaClient.connect(); } catch (e) { this.logger.error('ANTIFRAUD Kafka Client connect error', e) }
  }
  async onModuleDestroy() {
    await this.kafkaClient.close();
  }
}