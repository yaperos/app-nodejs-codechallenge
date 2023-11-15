import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaClient, Consumer, Message } from 'kafka-node';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from 'src/transactions/transaction.service';
import { AntiFruadService } from 'src/antiFraud/antiFraud.service';
import { Topics } from 'src/common/types/topicsNames';

@Injectable()
export class KafkaSubscriber implements OnModuleInit {
  private kafkaClient: KafkaClient;
  private consumer: Consumer;

  private topicHandlers = {
    [Topics.TRANSACTION_CREATED]: (eventData) =>
      this.antiFraudService.antiFraud(eventData),
    [Topics.APPROVED]: (eventData) =>
      this.transactionService.updateTransactionStatus(eventData),
    [Topics.REJECTED]: (eventData) =>
      this.transactionService.updateTransactionStatus(eventData),
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly antiFraudService: AntiFruadService,
  ) {}

  onModuleInit() {
    try {
      this.configureConsumer();
    } catch (error) {
      console.error('Error al iniciar KafkaSubscriber:', error);
    }
  }

  private configureConsumer() {
    const kafkaHost = this.configService.get<string>('KAFKA_HOST');
    this.kafkaClient = new KafkaClient({ kafkaHost });

    this.consumer = new Consumer(
      this.kafkaClient,
      [
        { topic: Topics.TRANSACTION_CREATED },
        { topic: Topics.APPROVED },
        { topic: Topics.REJECTED },
      ],
      { groupId: 'yape-group', autoCommit: true, fromOffset: false },
    );

    this.consumer.on('error', (error) => this.handleConsumerError(error));
    this.consumer.on('offsetOutOfRange', (error) =>
      this.handleOffsetOutOfRange(error),
    );
    this.consumer.on('message', (message: Message) =>
      this.processKafkaMessage(message),
    );
  }

  private async processKafkaMessage(message: Message) {
    try {
      const eventData = JSON.parse(message.value.toString());
      await this.topicHandlers[message.topic](eventData);
    } catch (error) {
      console.error('Error al procesar el evento de Kafka:', error);
    }
  }

  private handleConsumerError(error: any) {
    console.error('Error en el consumidor Kafka:', error);
  }

  private handleOffsetOutOfRange(error: any) {
    console.error('Offset fuera de rango en el consumidor Kafka:', error);
  }
}
