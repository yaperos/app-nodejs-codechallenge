import { AntifraudProducer } from '../../src/modules/transaction/infrastructure/kafka/antifraud.producer';
import { Kafka, Producer } from 'kafkajs';

jest.mock('kafkajs');

describe('AntifraudProducer', () => {
  let producerMock: jest.Mocked<Producer>;
  let producer: AntifraudProducer;

  beforeEach(async () => {
    producerMock = {
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    } as any;

    (Kafka as any).mockImplementation(() => ({
      producer: () => producerMock,
    }));

    producer = new AntifraudProducer();
    await producer.onModuleInit();
  });

  it('should send transaction_created event', async () => {
    const transaction = {
      id: 'tx-123',
      value: 1500,
    } as any;

    await producer.emitTransactionCreated(transaction);

    expect(producerMock.send).toHaveBeenCalledWith({
      topic: 'transaction_created',
      messages: [
        {
          key: 'tx-123',
          value: JSON.stringify(transaction),
        },
      ],
    });
  });

  it('should disconnect producer on destroy', async () => {
    await producer.onModuleDestroy();
    expect(producerMock.disconnect).toHaveBeenCalled();
  });
});
