import { StatusChangedConsumer } from '@adapters/messaging/status.consumer';
import { KafkaFactory } from '@adapters/messaging/kafka.factory';
import { SchemaRegistryService } from '@adapters/messaging/schema-registry.service';
import { UpdateTransactionStatusService } from '@application/services/update-transaction-status.service';
import { TRANSACTIONS_STATUS_CHANGED_TOPIC } from '@adapters/messaging/constants';

describe('StatusChangedConsumer', () => {
  const createConsumer = () => {
    const kafkaFactory = {
      createConsumer: jest.fn(() => consumerMock as any),
    } as unknown as jest.Mocked<KafkaFactory>;

    const schemaRegistry = {
      decode: jest.fn(),
    } as unknown as jest.Mocked<SchemaRegistryService>;

    const updateStatusService = {
      handle: jest.fn(),
    } as unknown as jest.Mocked<UpdateTransactionStatusService>;

    return { kafkaFactory, schemaRegistry, updateStatusService };
  };

  let consumerMock: {
    connect: jest.Mock;
    subscribe: jest.Mock;
    run: jest.Mock;
    disconnect: jest.Mock;
  };

  beforeEach(() => {
    consumerMock = {
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
      disconnect: jest.fn(),
    };
  });

  it('decodes message and updates transaction status', async () => {
    const { kafkaFactory, schemaRegistry, updateStatusService } = createConsumer();
    schemaRegistry.decode.mockResolvedValue({
      transactionExternalId: 'tx-1',
      status: 'approved',
      evaluatedAt: Date.now(),
      reason: null,
    });

    consumerMock.run.mockImplementation(async ({ eachMessage }) => {
      await eachMessage({
        topic: TRANSACTIONS_STATUS_CHANGED_TOPIC,
        partition: 0,
        message: {
          offset: '1',
          value: Buffer.from('payload'),
        },
      } as any);
    });

    const consumer = new StatusChangedConsumer(
      kafkaFactory,
      schemaRegistry,
      updateStatusService,
    );

    await consumer.onModuleInit();

    expect(consumerMock.connect).toHaveBeenCalled();
    expect(consumerMock.subscribe).toHaveBeenCalledWith({
      topic: TRANSACTIONS_STATUS_CHANGED_TOPIC,
      fromBeginning: false,
    });
    expect(updateStatusService.handle).toHaveBeenCalledWith(
      expect.objectContaining({ transactionExternalId: 'tx-1', status: 'approved' }),
    );
  });

  it('ignores messages without value', async () => {
    const { kafkaFactory, schemaRegistry, updateStatusService } = createConsumer();

    consumerMock.run.mockImplementation(async ({ eachMessage }) => {
      await eachMessage({
        topic: TRANSACTIONS_STATUS_CHANGED_TOPIC,
        partition: 0,
        message: {
          offset: '2',
        },
      } as any);
    });

    const consumer = new StatusChangedConsumer(
      kafkaFactory,
      schemaRegistry,
      updateStatusService,
    );

    await consumer.onModuleInit();

    expect(schemaRegistry.decode).not.toHaveBeenCalled();
    expect(updateStatusService.handle).not.toHaveBeenCalled();
  });
});
