import { Inject, Injectable, OnApplicationBootstrap, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KafkaConsumer, Producer } from 'node-rdkafka';
import { v4 as uuid } from 'uuid';
import { TOPICS } from '../kafka-subscribe.decorator';
import { KafkaPayload } from '../kafka-consumer.payload';
import { decode } from '../kafka-consumer.decode';
import { log } from 'console';

@Injectable()
export class KafkaService implements OnApplicationBootstrap, OnModuleDestroy {
  private consumer: KafkaConsumer;
  private producer: Producer;

  constructor(
    @Inject('KafkaConnection') kafkaConnection,
    private eventEmitter: EventEmitter2,
  ) {
    this.consumer = kafkaConnection.consumer;
    this.producer = kafkaConnection.producer;
  }

  public getConsumer(): KafkaConsumer {
      if (!this.consumer) {
          throw new Error('Consumer is not initialized.')
      }
      return this.consumer;
  }

  public getProducer(): Producer {
      if (!this.producer) {
          throw new Error('Producer is not initialized.')
      }
      return this.producer;
  }

  async onApplicationBootstrap(): Promise<void> {

    const topics = Array.from(TOPICS.keys());

    this.consumer.subscribe(topics);
    this.consumer.consume();

    let context = this;

    this.consumer
      .on('data', async (message): Promise<void> => {
        context.consumer.commit(message);
        try {

          const { key, value, topic, partition, offset, timestamp } = message;

          const body = await decode(value);
          const event = key?.toString()??'';

          const payload = (new KafkaPayload()).create(
            uuid(),
            body,
            event,
            topic,
            timestamp??0);

          const messageInfo = JSON.stringify({ topic, event, partition, offset, timestamp });

          if (context.eventEmitter.emit(event ? `${topic}.${event}` : `${topic}`, payload)) {
            log(`Message emitted: ${messageInfo}`, payload);
          }          

        } catch (error) {
          log("error on.data", error);
        }
      }).on('event.log', (log) => {
        log(log);
      })
      .on('event.error', (error) => {
        log('event.error', error);
        context.consumer.getMetadata({
          timeout: 10000
        }, (err, metadata) => {
          if (err) {
            log('Error getting metadata', error);
            context.disconnect();
          } else {
            log(`Consumer obtained metadata`);
          }
        })
      });
  }

  async onModuleDestroy(): Promise<void> {
    log(`Consumer disconnect...`);
    this.consumer.disconnect();
  }

  async disconnect(): Promise<void> {
    log(`Trying to restart service...`);    
    process.abort();
  }
  
}
