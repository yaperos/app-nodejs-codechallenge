import { When } from '@cucumber/cucumber';
import { ConfigService } from '@nestjs/config';
import { Kafka, logLevel, Producer } from 'kafkajs';
import { KafkaConfig } from 'src/config/services/kafka/kafka.config';
import { KAFKA_TRANSACTION_CONFIG_KEY } from 'src/config/services/kafka/kafka-transaction.config';

import { application } from './hooks.steps';

const kafkaConfigKeyMap: Map<string, string> = new Map<string, string>([
  ['transaction', KAFKA_TRANSACTION_CONFIG_KEY],
]);
let kafka: Kafka;
let producer: Producer;

When(
  'the following event is published in {string}:',
  async (kafkaOrigin: string, data: string) => {
    const kafkaConfig = getKafkaConfig(kafkaOrigin);
    initProducer(kafkaConfig);
    const event = eventParser(data);
    await publishEvent(event);
  },
);

function getKafkaConfig(kafkaOrigin: string): KafkaConfig {
  if (!kafkaConfigKeyMap.has(kafkaOrigin)) {
    throw new Error();
  }
  const kafkaConfigKey = kafkaConfigKeyMap.get(kafkaOrigin);
  const config = application.get(ConfigService);
  return config.get<KafkaConfig>(kafkaConfigKey);
}

function initProducer(kafkaConfig: KafkaConfig) {
  kafka = new Kafka({
    clientId: 'test',
    brokers: kafkaConfig.brokers,
    logLevel: logLevel.NOTHING,
  });
  producer = kafka.producer();
}

function eventParser(data: string) {
  const event = JSON.parse(data);
  if (!('type' in event)) {
    throw new Error();
  }
  return event;
}

async function publishEvent(event: any) {
  await producer.connect();
  await producer.send({
    topic: event.type,
    messages: [
      {
        value: JSON.stringify(event),
      },
    ],
  });
  await producer.disconnect();
}
