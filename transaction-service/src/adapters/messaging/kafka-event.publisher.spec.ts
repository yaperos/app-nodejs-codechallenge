import { KafkaEventPublisher } from './kafka-event.publisher';
import { KafkaFactory } from './kafka.factory';
import { SchemaRegistryService } from './schema-registry.service';
import { OutboxMessage } from '@domain/outbox';
import { TransactionStatusChangedEvent } from '@domain/transaction';
import { TRANSACTIONS_STATUS_CHANGED_TOPIC, TRANSACTIONS_CREATED_TOPIC } from './constants';

describe('KafkaEventPublisher', () => {
  let kafkaFactory: jest.Mocked<KafkaFactory>;
  let schemaRegistry: jest.Mocked<SchemaRegistryService>;
  let publisher: KafkaEventPublisher;
  let producer: { connect: jest.Mock; disconnect: jest.Mock; send: jest.Mock };

  beforeEach(() => {
    producer = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      send: jest.fn(),
    };

    kafkaFactory = {
      createProducer: jest.fn(() => producer as any),
      createConsumer: jest.fn(),
      createAdmin: jest.fn(),
    } as unknown as jest.Mocked<KafkaFactory>;

    schemaRegistry = {
      encode: jest.fn(async (_topic, payload) => Buffer.from(JSON.stringify(payload))),
      decode: jest.fn(),
      getSchemaId: jest.fn(),
      ensureSchema: jest.fn(),
    } as unknown as jest.Mocked<SchemaRegistryService>;

    publisher = new KafkaEventPublisher(kafkaFactory, schemaRegistry);
  });

  it('connects on module init and disconnects on destroy', async () => {
    await publisher.onModuleInit();
    expect(producer.connect).toHaveBeenCalled();

    await publisher.onModuleDestroy();
    expect(producer.disconnect).toHaveBeenCalled();
  });

  it('publishes outbox messages with encoded payload', async () => {
    await publisher.onModuleInit();
    const message: OutboxMessage = {
      id: 'id-1',
      topic: TRANSACTIONS_CREATED_TOPIC,
      key: 'tx-1',
      payload: { foo: 'bar' },
    };

    await publisher.publishOutboxMessage(message);

    expect(schemaRegistry.encode).toHaveBeenCalledWith(message.topic, message.payload);
    expect(producer.send).toHaveBeenCalledWith({
      topic: message.topic,
      messages: [{ key: 'tx-1', value: expect.any(Buffer) }],
    });
  });

  it('throws if outbox message lacks id', async () => {
    await publisher.onModuleInit();
    const message: OutboxMessage = {
      topic: TRANSACTIONS_CREATED_TOPIC,
      key: 'tx-1',
      payload: {},
    };

    await expect(publisher.publishOutboxMessage(message)).rejects.toThrow(
      'Outbox message must have an id before publishing',
    );
  });

  it('publishes status changed events with timestamp conversion', async () => {
    await publisher.onModuleInit();
    const event: TransactionStatusChangedEvent = {
      transactionExternalId: 'tx-2',
      status: 'approved',
      reason: null,
      evaluatedAt: new Date('2025-01-01T00:00:00Z'),
    };

    await publisher.publishTransactionStatusChanged(event);

    expect(schemaRegistry.encode).toHaveBeenCalledWith(
      TRANSACTIONS_STATUS_CHANGED_TOPIC,
      expect.objectContaining({ evaluatedAt: event.evaluatedAt.getTime() }),
    );
    expect(producer.send).toHaveBeenCalledWith({
      topic: TRANSACTIONS_STATUS_CHANGED_TOPIC,
      messages: [{ key: 'tx-2', value: expect.any(Buffer) }],
    });
  });
});
