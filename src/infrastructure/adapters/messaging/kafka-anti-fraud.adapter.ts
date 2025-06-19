import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';
import { AntiFraudPort, TransactionCreatedEvent, TransactionStatusUpdatedEvent } from '@domain/ports/anti-fraud.port';
import { TransactionEntity } from '@domain/entities/transaction.entity';
import { LoggerPort } from '@domain/ports/logger.port';

@Injectable()
export class KafkaAntiFraudAdapter implements AntiFraudPort, OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(@Inject('LoggerPort') private readonly logger: LoggerPort) {
    this.kafka = new Kafka({
      clientId: 'yape-transaction-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ 
      groupId: process.env.KAFKA_GROUP_ID || 'yape-transaction-service' 
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    
    this.logger.info('Adaptador Kafka inicializado exitosamente', 'KafkaAntiFraudAdapter');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    
    this.logger.info('Adaptador Kafka destruido exitosamente', 'KafkaAntiFraudAdapter');
  }

  async sendTransactionCreated(transaction: TransactionEntity): Promise<void> {
    const event: TransactionCreatedEvent = {
      transactionExternalId: transaction.transactionExternalId,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      tranferTypeId: transaction.tranferTypeId,
      value: transaction.value,
      createdAt: transaction.createdAt,
    };

    const topicName = process.env.ANTI_FRAUD_TOPIC || 'transaction-created';

    try {
      await this.producer.send({
        topic: topicName,
        messages: [
          {
            key: transaction.transactionExternalId,
            value: JSON.stringify(event),
            headers: {
              'event-type': 'TransactionCreated',
            },
          },
        ],
      });

      this.logger.info(
        `Evento de transacción creada enviado: ${transaction.transactionExternalId}`,
        'KafkaAntiFraudAdapter',
      );
    } catch (error) {
      this.logger.error(
        `Error al enviar evento de transacción creada: ${transaction.transactionExternalId}`,
        error as Error,
        'KafkaAntiFraudAdapter',
      );
      throw error;
    }
  }

  async onTransactionStatusUpdated(
    callback: (event: TransactionStatusUpdatedEvent) => Promise<void>,
  ): Promise<void> {
    const topicName = process.env.TRANSACTION_STATUS_TOPIC || 'transaction-status-updated';

    await this.consumer.subscribe({ topic: topicName, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (message.value) {
            const event: TransactionStatusUpdatedEvent = JSON.parse(
              message.value.toString(),
            );

            this.logger.info(
              `Evento de actualización de estado de transacción recibido: ${event.transactionExternalId}`,
              'KafkaAntiFraudAdapter',
            );

            await callback(event);
          }
        } catch (error) {
          this.logger.error(
            `Error al procesar evento de actualización de estado de transacción`,
            error as Error,
            'KafkaAntiFraudAdapter',
          );
        }
      },
    });
  }
} 