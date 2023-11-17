import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Producer, KafkaClient, KeyedMessage } from 'kafka-node';


@Injectable()
export class TransactionService {
  private readonly kafkaClient: KafkaClient;
  private readonly producer: Producer;


  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {
    this.kafkaClient = new KafkaClient({ kafkaHost: 'kafka:29092' });
    this.producer = new Producer(this.kafkaClient);
  }

  async createTransaction(transactionData: any): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionData);

    if (!transactionData.value || !transactionData.accountExternalIdDebit || !transactionData.accountExternalIdCredit || !transactionData.tranferTypeId ) {
      throw new BadRequestException('Error in transaction fields');
    }  
    if (transaction instanceof Transaction) {
      const [savedTransaction] = await this.transactionRepository.save([transaction]);
      const kafkaMessage = {
        topic: 'transaction-topic',
        messages: JSON.stringify(savedTransaction),
      };

      this.producer.send([kafkaMessage], (err, data) => {
        if (err) {
          console.error(`Error sending message to Kafka: ${err}`);
        }
      });
      let validatedTransatction = await this.validateTransatction([savedTransaction]);
      return savedTransaction;
    } else {
      throw new Error('Error createTransaction');
    }
  }

  async getTransaction(transactionExternalId: string): Promise<Transaction | undefined> {
    const kafkaMessage = {
      topic: 'transaction-getTransaction-topic',
      messages: JSON.stringify(transactionExternalId),
    };

    this.producer.send([kafkaMessage], (err, data) => {
      if (err) {
        console.error(`Error sending message to Kafka: ${err}`);
      }
    });
    
    return this.transactionRepository.findOne({ where: { transactionExternalId } });
  }

  async validateTransatction(transactionData: any): Promise<Transaction> {
    try {
      return transactionData.map(transaction => {
        if (transaction.value < 1000 && transaction.value > 0) {
          transaction.updateTransactionStatus('approved');
        } else {
          transaction.updateTransactionStatus('rejected');
        }
        const kafkaMessage = {
          topic: 'transaction-updateStatus-topic',
          messages: JSON.stringify(transaction),
        };
  
        this.producer.send([kafkaMessage], (err, data) => {
          if (err) {
            console.error(`Error sending message to Kafka: ${err}`);
          }
        });
        return transaction;
      });
    } catch (error) {
      throw new Error(`Error validateTransaction: ${error.message}`);
    }
  }
}


