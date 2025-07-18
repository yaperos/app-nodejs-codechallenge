import { Injectable, Inject, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { kafkaConfig } from '../config/kafka.config';
import { Kafka, Consumer } from 'kafkajs';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { ReactiveKafkaProducer } from './kafka-producer.service';
import { TransactionService } from './transaction.service';
import { RawTransaction } from '../model/raw-transaction.model';
import { ValidationResult } from '../model/validation-result.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReactiveKafkaConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReactiveKafkaConsumer.name);
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    @Inject(kafkaConfig.KEY)
    private readonly kafkaConfiguration: ConfigType<typeof kafkaConfig>,
    private readonly reactiveKafkaProducer: ReactiveKafkaProducer,
    private readonly transactionService: TransactionService,
  ) {
    this.kafka = new Kafka({
      clientId: 'nestjs-consumer',
      brokers: this.kafkaConfiguration.bootstrapServers,
      connectionTimeout: 10000,
      requestTimeout: 30000,
    });

    this.consumer = this.kafka.consumer({
      groupId: this.kafkaConfiguration.consumer.groupId,
      allowAutoTopicCreation: true,
    });

    this.logger.log(`🔧 Kafka Consumer configured with brokers: ${this.kafkaConfiguration.bootstrapServers.join(', ')}`);
  }

  async onModuleInit() {
    try {
      this.logger.log('🔄 Connecting to Kafka Consumer...');
      await this.consumer.connect();

      const topic = this.kafkaConfiguration.consumer.topic;
      this.logger.log(`📡 Subscribing to topic: ${topic}`);

      await this.consumer.subscribe({
        topic: topic,
        fromBeginning: this.kafkaConfiguration.consumer.fromBeginning, // ✅ Usar configuración para inicio desde el principio
      });

      this.logger.log('✅ Kafka Consumer connected successfully');
      this.startConsuming();
    } catch (error) {
      this.logger.error('❌ Failed to start consuming Kafka messages', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.consumer.disconnect();
      this.logger.log('Kafka Consumer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka Consumer:', error);
    }
  }

  private startConsuming() {
    this.consumer.run({
      autoCommit: this.kafkaConfiguration.consumer.autoCommit, // ✅ Deshabilitar auto-commit para control manual
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        this.processMessage(message);

        try {
          await this.processRecord(message, topic, partition).toPromise();

          if (!this.kafkaConfiguration.consumer.autoCommit) {
            await this.consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (parseInt(message.offset) + 1).toString(),
              },
            ]);
          }

          await heartbeat();
        } catch (error) {
          this.logger.error('Error processing record:', error);
        }
      },
    });
  }

  private processMessage(message: any) {
    const key = message.key?.toString();
    const value = message.value?.toString();
    this.logger.log(`📨 Message received: key = ${key}, value = ${value}`);
  }

  private processRecord(message: any, topic: string, partition: number): Observable<void> {
    this.logger.log(`🔄 Starting processRecord for message from ${topic}:${partition}`);

    return of(message).pipe(
      map(msg => {
        this.logger.log(`🔄 Step 1: Calling getRawTransaction`);
        return this.getRawTransaction(msg);
      }),

      tap(transaction => {
        this.logger.log(`🔄 Step 2: Got transaction ${transaction.getId()}, calling analyzeRawTransaction`);
      }),

      switchMap(transaction => {
        this.logger.log(`🔄 Step 3: Entering analyzeRawTransaction for ${transaction.getId()}`);
        return this.analyzeRawTransaction(transaction);
      }),

      tap(validationResult => {
        this.logger.log(`🔄 Step 4: Got validation result, calling sendValidationResult`);
      }),

      switchMap(validationResult => this.sendValidationResult(validationResult)),

      catchError(error => {
        this.logger.error('❌ Error in processRecord pipeline:', error);
        throw error;
      }),

      tap(() => {
        this.logger.log(`🔄 Step 5: Message processed successfully`);
      }),
    );
  }

  private getRawTransaction(message: any): RawTransaction {
    try {
      const value = message.value?.toString();
      if (!value) {
        throw new Error('Message value is empty');
      }

      const data = JSON.parse(value);
      const rawTransaction = RawTransaction.builder()
        .id(data.id)
        .amount(data.amount)
        .currency(data.currency)
        .build();

      this.logger.log(`📋 Parsed transaction: ${rawTransaction.getId()}, amount: ${rawTransaction.getAmount()}`);

      return rawTransaction;
    } catch (error) {
      this.logger.error('Error parsing message:', error);
      throw new Error(`Failed to parse message: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private analyzeRawTransaction(transaction: RawTransaction): Observable<ValidationResult> {
    return this.transactionService.analyzeTrx(of(transaction)).pipe(
      tap(result => {
        this.logger.log(`🔍 Validation result for ${transaction.getId()}: fraud=${result.getIsFraudulent()}`);
      }),
      catchError(error => {
        this.logger.error('Error analyzing transaction:', error);
        throw error;
      })
    );
  }

  private sendValidationResult(validationResult: ValidationResult): Observable<void> {
    const validationResultJson = this.getValidationResultAsJson(validationResult);
    const topic = this.kafkaConfiguration.producer.topic;
    const key = uuidv4();

    this.logger.log(`📤 Sending validation result to topic ${topic}: ${validationResult.getTransactionId()}`);

    return this.reactiveKafkaProducer.sendMessage(topic, key, validationResultJson).pipe(
      catchError(error => {
        this.logger.error('Error sending message:', error);
        throw error;
      })
    );
  }

  private getValidationResultAsJson(validationResult: ValidationResult): string {
    try {
      const resultObj = {
        transactionId: validationResult.getTransactionId(),
        isFraudulent: validationResult.getIsFraudulent(),
        reason: validationResult.getReason()
      };

      const json = JSON.stringify(resultObj);
      return json;
    } catch (error) {
      this.logger.error('Error parsing message:', error);
      throw new Error(`Failed to serialize validation result: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

}