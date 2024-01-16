import { Kafka, Consumer } from 'kafkajs';
import dotenv from 'dotenv';
import axios from 'axios';
import { Logger } from '../../../../Shared/infrastructure/Logger';
import { Messages } from '../../../../Shared/utils/messages';
import { UpdateTransaction } from '../../../../Shared/infrastructure/http/updateTransaction';
import { KafkaProducerService } from '../../../../Shared/infrastructure/kafka/sendMessage';

dotenv.config();

class KafkaConsumerService {
  private consumer: Consumer;
  private logger: Logger;

  constructor() {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'default-client',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
    });
    this.logger = new Logger();
    this.consumer = kafka.consumer({ groupId: 'group-default' });
  }

  public async start(): Promise<void> {
    
    const kafkaProducer = new KafkaProducerService();

    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'transactions_anti_fraud', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value) {
          let transactionMessage: any;
          try {
            transactionMessage = JSON.parse(message.value.toString());
            if (transactionMessage && transactionMessage.message && transactionMessage.message.data) {
              const data = transactionMessage.message.data;
              const uuid = transactionMessage.message.data.transactionExternalId;
              if (data.transactionStatus.name === 'pending') {
                const status = data.value > 1000 ? Messages.REJECTED : Messages.APPROVED;
                let kafkaPayloadUpdated = {
                  transactionExternalId: uuid,
                  transactionType: { name: 'Status Approved' }, 
                  transactionStatus: {
                    name: status
                  },
                  value : data.value,
                  createdAt: data.createdAt,
                }
                const updateTransaction = new UpdateTransaction(uuid, status);
                const API_TRANSACTION = process.env.API_TRANSACTION || 'http://localhost';
                const API_TRANSACTION_PORT = process.env.API_TRANSACTION_PORT || '4001';
                const API_TRANSACTION_PATH = process.env.API_TRANSACTION_PATH || '/transaction';
                const apiUrl = `${API_TRANSACTION}:${API_TRANSACTION_PORT}${API_TRANSACTION_PATH}`;
                const requestData = {
                  uuid: data.transactionExternalId,
                  status: status
                };
                try {
                  await axios.put(apiUrl, requestData);
                  this.logger.debug(`Transaction ${data.transactionExternalId} status updated to ${status}`);
                  await kafkaProducer.sendToKafkaService(kafkaPayloadUpdated);
                } catch (httpError) {
                  this.logger.error(`Error during HTTP request: ${httpError}`);
                }
              }
            }
          } catch (error) {
            this.logger.error(`Error processing message: ${error}`);
          }
        }
      },
    });
  }
}

const kafkaConsumerService = new KafkaConsumerService();
kafkaConsumerService.start().catch(console.error);

export default kafkaConsumerService;
