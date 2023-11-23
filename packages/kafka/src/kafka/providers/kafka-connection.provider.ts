import * as uuid from 'uuid';
import * as rdkafka from 'node-rdkafka';
import { KafkaConnectionOptions } from '../interfaces/kafka-connection-options';
import { KafkaConsumerOptions } from '../interfaces/kafka-consumer-options';
import { KafkaProducerOptions } from '../interfaces/kafka-producer-options';
import { KafkaAdminClientOptions } from '../interfaces/kafka-admin-client-options';
// import { nanoid } from 'nanoid'
import { TOPICS } from '../kafka-subscribe.decorator';
import { Logger } from "@nestjs/common"

const logger = new Logger("KafkaConsumer");

async function connectConsumer(options: KafkaConsumerOptions): Promise<rdkafka.KafkaConsumer> {
  try {

    const env = process.env.environment;
    const username = require("os").userInfo().username;
    let { "group.id": groupId } = options.conf;
    groupId = `${groupId}-${env || username}`;
    // const clientId = `${groupId}-${nanoid(10)}`;
    const clientId = `${groupId}`;
    options.conf['client.id'] = clientId;
    options.conf['group.id'] = groupId;

    const consumer = new rdkafka.KafkaConsumer(options.conf, options.topicConf);

    await new Promise<void>((resolve) => {
      consumer.on('ready', ({ name }, { orig_broker_id, orig_broker_name }) => {
        logger.log(`Connection ready: ${JSON.stringify({ clientId })}`);
        logger.log(`Topics subscribed: ${JSON.stringify(Array.from(TOPICS.keys()))}`);
        resolve();
      });
      consumer.connect();
    });

    return consumer;
  } catch (err) {
    throw err;
  }
}

async function connectProducer(options: KafkaProducerOptions): Promise<rdkafka.Producer> {
  try {
    if (!options['transactional.id']) {
      options['transactional.id'] = uuid.v1();
    }
    const producer = new rdkafka.Producer(options.conf, options.topicConf);
    await new Promise<void>((resolve) => {
      producer.on('ready', () => resolve());
      producer.connect();
    });
    return producer;
  } catch (err) {
    throw err;
  }
}

async function connectAdminClient(options: KafkaAdminClientOptions): Promise<rdkafka.IAdminClient> {
  try {
    return rdkafka.AdminClient.create(options.conf);
  } catch (err) {
    throw err;
  }
}

export function KafkaConnectionProvider(options: KafkaConnectionOptions) {

  return {
    provide: 'KafkaConnection',
    useFactory: async (): Promise<{ adminClient?: rdkafka.IAdminClient, consumer?: rdkafka.KafkaConsumer, producer?: rdkafka.Producer }> => {
      let adminClient: rdkafka.IAdminClient;
      let consumer: rdkafka.KafkaConsumer;
      let producer: rdkafka.Producer;

      return {
        adminClient: options.adminClient ? await connectAdminClient(options.adminClient) : adminClient,
        consumer: options.consumer ? await connectConsumer(options.consumer) : consumer,
        producer: options.producer ? await connectProducer(options.producer) : producer
      };
    }
  }
};