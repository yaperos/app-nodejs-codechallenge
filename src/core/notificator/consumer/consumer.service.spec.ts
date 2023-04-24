import { Kafka, Consumer } from 'kafkajs';
import { ConsumerService } from './consumer.service';

jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockReturnValue({
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
    }),
  }),
}));

describe('ConsumerService', () => {
  let consumerService: ConsumerService;
  let kafka: Kafka;
  let consumer: Consumer;

  beforeEach(() => {
    consumerService = new ConsumerService();
    kafka = new Kafka({ brokers: ['localhost:9092'] });
    consumer = kafka.consumer({ groupId: 'anti-fraud' });
  });

  it('should consume messages from Kafka', async () => {
    await consumerService.consume({
      topics: ['test-topic'],
      fromBeginning: true,
    }, {
      eachMessage: jest.fn(),
    });

    expect(kafka.consumer).toHaveBeenCalledTimes(3);
    expect(kafka.consumer).toHaveBeenCalledWith({
      groupId: 'anti-fraud',
    });
    expect(consumer.connect).toHaveBeenCalledTimes(1);
    expect(consumer.subscribe).toHaveBeenCalledTimes(1);
    expect(consumer.subscribe).toHaveBeenCalledWith({
      topics: ['test-topic'],
      fromBeginning: true,
    });
    expect(consumer.run).toHaveBeenCalledTimes(1);
  });

  it('should consume update messages from Kafka', async () => {
    await consumerService.consumeUpdate({
      topics: ['test-topic'],
      fromBeginning: true,
    }, {
      eachMessage: jest.fn(),
    });

    expect(kafka.consumer).toHaveBeenCalledTimes(3);
    expect(kafka.consumer).toHaveBeenCalledWith({
      groupId: 'update-data',
    });
    expect(consumer.connect).toHaveBeenCalledTimes(1);
    expect(consumer.subscribe).toHaveBeenCalledTimes(1);
    expect(consumer.subscribe).toHaveBeenCalledWith({
      topics: ['test-topic'],
      fromBeginning: true,
    });
    expect(consumer.run).toHaveBeenCalledTimes(1);
  });
});
