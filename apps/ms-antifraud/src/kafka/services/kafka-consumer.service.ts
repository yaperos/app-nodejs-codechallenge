import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { TransactionService } from '../../transactions/services/transaction.service';
import { TransactionDto } from '../../common/dto/transaction.dto';

@Injectable()
export class KafkaConsumerService {
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor(private readonly transactionService: TransactionService) {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER_1],
    });

    this.consumer = kafka.consumer({ groupId: process.env.KAFKA_TRANSACTIONS_GROUP });
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
    } catch (error) {
      this.logger.error(`Error connecting to Kafka consumer: ${error.message}`);
      throw error;
    }
  }

  async subscribeToTopic(): Promise<void> {
    try {
      await this.consumer.subscribe({ topic: process.env.KAFKA_TRANSACTIONS_TOPIC, fromBeginning: true });
    } catch (error) {
      this.logger.error(`Error subscribing to Kafka topic: ${error.message}`);
      throw error;
    }
  }

  async run(): Promise<void> {
    try {
      await this.subscribeToTopic();

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
          try {
            console.log(`Received message from topic ${topic}, partition ${partition}: ${message.value.toString()}`);
            
            const transactionData: TransactionDto = JSON.parse(message.value.toString());
        
            const isFraudulent = transactionData.value > parseInt(process.env.FRAUD_THRESHOLD_AMOUNT) ;
        
            const transactionStatus = isFraudulent ? 'rejected' : 'approved';
        
            await this.transactionService.updateTransaction(transactionData, transactionStatus);
        
            console.log(`Transaction ${transactionData.transactionExternalId} has been ${transactionStatus}`);
          } catch (error) {
            this.logger.error(`Error processing Kafka message: ${error.message}`);
          }
        },
      });
    } catch (error) {
      this.logger.error(`Error running Kafka consumer: ${error.message}`);
      throw error;
    }
  }
}
