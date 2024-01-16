import { Kafka, Consumer } from 'kafkajs';
import dotenv from 'dotenv';
import { TransactionStatus } from '../../application/services/transaction-status/transactionStatus';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { PrismaClient } from '../../../../../prisma/generated/client';
import { Logger
 } from '../../../../Shared/infrastructure/Logger';
import KafkaProducerService from '../../../../Shared/infrastructure/kafka/sendMessage';
dotenv.config();

class KafkaConsumerService {

  private consumer: Consumer;
  private transactionStatus : TransactionStatus;

  constructor() {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'default-client',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
    });
    const prismaClient = new PrismaClient();
    const logger = new Logger();
    const kafkaProducerService = new KafkaProducerService();
    const transactionRepository = new TransactionRepository(prismaClient, logger);
    this.consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'default-group' });
    this.transactionStatus = new TransactionStatus(transactionRepository, logger, kafkaProducerService);
  }

  public async start(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: process.env.KAFKA_TOPIC || 'transactions', fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value) {
          let transactionMessage;
          try {
              transactionMessage = JSON.parse(message.value.toString());
          } catch (error) {
              transactionMessage = message.value.toString();
          }
          this.transactionStatus.newTransactionEvent(transactionMessage);
      }
      },
    });
  }
}

const kafkaConsumerService = new KafkaConsumerService();
kafkaConsumerService.start().catch(console.error);

export default kafkaConsumerService;
