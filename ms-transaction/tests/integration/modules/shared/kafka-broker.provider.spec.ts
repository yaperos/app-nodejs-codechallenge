import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Consumer, Kafka, logLevel } from 'kafkajs';
import { firstValueFrom, Subject } from 'rxjs';
import { BrokerModule } from 'src/config/broker/broker.module';
import {
  KAFKA_BROKER_CONFIG_KEY,
  KafkaBrokerConfig,
} from 'src/config/broker/kafka-broker.config';
import { KafkaBrokerProvider } from 'src/modules/shared/infrastructure/providers/kafka-broker.provider';
import {
  IntegerMother,
  StringMother,
  UuidMother,
} from 'tests/unit/modules/shared/domain/mothers';
import { TestedDomainEvent } from 'tests/unit/modules/shared/domain/tested-domain.event';

describe('KafkaBrokerProvider test', () => {
  const event = new TestedDomainEvent({
    aggregateId: UuidMother.random(),
    fieldString: StringMother.random(),
    fieldInteger: IntegerMother.random(),
  });

  let testingModule: TestingModule;
  let kafkaBrokerProvider: KafkaBrokerProvider;
  let kafka: Kafka;
  let consumer: Consumer;
  let destroy$: Subject<void>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), BrokerModule],
      providers: [KafkaBrokerProvider],
    }).compile();
    kafkaBrokerProvider = testingModule.get(KafkaBrokerProvider);

    const config = testingModule.get(ConfigService);
    const kafkaBrokerConfig = config.get<KafkaBrokerConfig>(
      KAFKA_BROKER_CONFIG_KEY,
    );

    kafka = new Kafka({
      brokers: kafkaBrokerConfig.brokers,
      logLevel: logLevel.NOTHING,
    });
    await createTopic(kafka, event.eventName);

    consumer = kafka.consumer({ groupId: 'test-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: event.eventName, fromBeginning: false });
  });

  beforeEach(() => {
    destroy$ = new Subject<void>();
  });

  afterEach(() => {
    destroy$.complete();
  });

  afterAll(async () => {
    await consumer.disconnect();
    await testingModule.close();
  });

  it('should test publish event', async () => {
    let eventRecived: any;
    const messageHandler = async ({ message }) => {
      eventRecived = JSON.parse(message.value.toString());
      destroy$.next();
    };

    await consumer.run({ eachMessage: messageHandler });

    const event = new TestedDomainEvent({
      aggregateId: UuidMother.random(),
      fieldString: StringMother.random(),
      fieldInteger: IntegerMother.random(),
    });
    await kafkaBrokerProvider.publishEvent(event);

    await firstValueFrom(destroy$);
    expect(eventRecived).toEqual(JSON.parse(JSON.stringify(event)));
  }, 20000);
});

const createTopic = async (kafka: Kafka, topicName: string) => {
  const admin = kafka.admin();
  await admin.connect();
  const existingTopics = await admin.listTopics();
  if (!existingTopics.includes(topicName)) {
    await admin.createTopics({
      topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 1 }],
    });
  }
  await admin.disconnect();
};
