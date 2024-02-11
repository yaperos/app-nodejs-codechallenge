import { Injectable } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './transaction.dto';

@Injectable()
export class KafkaConsumerService {
  private consumer: Consumer;

  constructor(private readonly transactionService: TransactionService) {
    const kafka = new Kafka({
      clientId: 'consumer-client',
      brokers: ['kafka:29092'],
    });

    this.consumer = kafka.consumer({ groupId: 'group1' });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
  }

  async subscribeToTopic(): Promise<void> {
    await this.consumer.subscribe({ topic: 'yape.transactions', fromBeginning: true });
  }

  async run(): Promise<void> {
    await this.subscribeToTopic();

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message from topic ${topic}, partition ${partition}: ${message.value.toString()}`);
        
        const transactionData: TransactionDto = JSON.parse(message.value.toString());
    
        const isFraudulent = transactionData.value > 1000;
    
        const transactionStatus = isFraudulent ? 'rejected' : 'approved';
    
        await this.transactionService.updateTransaction(transactionData, transactionStatus);

        console.log(`Transaction ${transactionData.transactionExternalId} has been ${transactionStatus}`)
      }
    });
  }
}
