import { Producer, Kafka } from 'kafkajs';
import { ProducerService } from './producer.service';

jest.mock('kafkajs', () => ({
    Kafka: jest.fn().mockReturnValue({
      producer: jest.fn().mockReturnValue({
        connect: jest.fn(),
        disconnect: jest.fn(),
        sendBatch: jest.fn(),
      }),
    }),
  }));

describe('ProducerService', () => {
  let producerService: ProducerService;
  let producerMock: jest.Mocked<Producer>;
  let kafka: Kafka;
  beforeEach(() => {
    producerService = new ProducerService();
    kafka = new Kafka({ brokers: ['localhost:9092'] });
    producerMock = kafka.producer()  as jest.Mocked<Producer>;
    producerService = new ProducerService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('producer', () => {
    it('should call sendBatch method with correct arguments', async () => {
      const message = { data: { foo: 'bar' } };
      await producerService.__producer([message]);

      expect(producerMock.sendBatch).toHaveBeenCalledWith({
        topicMessages: [
          {
            topic: 'anti-fraud',
            messages: [{ value: JSON.stringify(message) }]
          }
        ]
      });
    });
  });

  describe('producerUpdate', () => {
    it('should call sendBatch method with correct arguments', async () => {
      const message = { data: { foo: 'bar' } };
      await producerService.__producerUpdate([message]);

      expect(producerMock.sendBatch).toHaveBeenCalledWith({
        topicMessages: [
          {
            topic: 'update-data',
            messages: [{ value: JSON.stringify(message) }]
          }
        ]
      });
    });
  });
});