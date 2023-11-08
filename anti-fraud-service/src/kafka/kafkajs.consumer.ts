import { Logger } from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import { sleep } from '../utils/sleep';
import { IConsumer } from './consumer.interface';
import { PrismaService } from 'src/database/prisma';

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopics,
    private databaseService: PrismaService,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topics}-${config.groupId}`);
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({topic, message, partition }) => {
        this.logger.debug(`${topic} -- Processing message partition: ${partition}`);
      
       try {
          await this.addMessageToDlq(message);
        } catch (err) {
          this.logger.error(
            'Error consuming message..',
            err,
          );
        }
      },
    });

    
  }

  private async addMessageToDlq(message: KafkaMessage) {
    this.logger.log("here database", message.value.toString())
 
    try {
      const uuid = message.value.toString()
      if(!this.antiFraudCheck(uuid)){
        this.logger.error(`error to update in database, rejected ${uuid}`)
        return
      }

      this.updateTransactionStatus(uuid, 'aproved')
  
    } catch (error) {
      this.logger.error("error to update in database", error)
    }
  }


  private async updateTransactionStatus(uuid: string, status: string){
    await this.databaseService.transactionStatus.update({
      where: {
        id: uuid
      },
      data: {
        name: status
      }
    })
  }

   private antiFraudCheck(inputString: string): boolean {
    if (!inputString) {
        return false;
    }

    if (inputString.length < 36) {
        return false;
    }

    return true;
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}