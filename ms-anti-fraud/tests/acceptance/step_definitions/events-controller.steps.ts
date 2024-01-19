import { Then } from '@cucumber/cucumber';
import { ConfigService } from '@nestjs/config';
import * as assert from 'assert';
import { Consumer, Kafka, logLevel } from 'kafkajs';
import { firstValueFrom, Subject } from 'rxjs';
import {
  KAFKA_BROKER_CONFIG_KEY,
  KafkaBrokerConfig,
} from 'src/config/broker/kafka-broker.config';

import { application, sleep } from './hooks.steps';

let kafka: Kafka;
let consumer: Consumer;

Then('the application should consume and process the event', async () => {
  await sleep(500);
});

Then('should publish the following event:', async (data: string) => {
  const eventExpected = JSON.parse(data);
  const eventRecived = await getOneEvent(eventExpected.type);
  assertEvent(eventRecived, eventExpected);
});

async function getOneEvent(topic: string) {
  let eventRecived: any;
  const destroy$ = new Subject<void>();

  initConsumer();
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  const messageHandler = async ({ message }) => {
    eventRecived = JSON.parse(message.value.toString());
    destroy$.next();
  };
  await consumer.run({ eachMessage: messageHandler });
  await firstValueFrom(destroy$);
  await consumer.disconnect();

  destroy$.complete();
  return eventRecived;
}

function initConsumer() {
  if (!kafka) {
    const config = application.get(ConfigService);
    const kafkaBrokerConfig = config.get<KafkaBrokerConfig>(
      KAFKA_BROKER_CONFIG_KEY,
    );
    kafka = new Kafka({
      brokers: kafkaBrokerConfig.brokers,
      logLevel: logLevel.NOTHING,
    });
  }

  if (!consumer) {
    consumer = kafka.consumer({ groupId: 'test-group' });
  }
}

function assertEvent(event: any, expectedEvent: any) {
  Object.keys(expectedEvent).forEach((key) => {
    if (key === 'occurredOn') {
      assert.ok(
        typeof event.occurredOn === 'string' &&
          new Date(event.occurredOn).toISOString() === event.occurredOn,
      );
    } else if (key === 'id') {
      assert.ok(typeof event.id === 'string');
    } else {
      assert.deepEqual(event[key], expectedEvent[key]);
    }
  });
}
