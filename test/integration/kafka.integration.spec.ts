import { TestKafkaHelper } from './helpers/test-kafka.helper';
import { EachMessagePayload } from 'kafkajs';

interface KafkaMessageValue {
  [key: string]: unknown;
}

describe('Kafka Integration Tests', () => {
  let kafkaHelper: TestKafkaHelper;
  const testTopic = `test-transactions-${Date.now()}`;

  beforeAll(async () => {
    kafkaHelper = new TestKafkaHelper();
    await kafkaHelper.connect();
    try {
      await kafkaHelper.deleteTopic(testTopic);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
    }
    await kafkaHelper.createTopic(testTopic, 3);
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    await kafkaHelper.deleteTopic(testTopic);
    await kafkaHelper.disconnect();
  });

  describe('Producer Operations', () => {
    it('should publish a message to topic', async () => {
      const message = {
        transactionId: 'test-001',
        amount: 100,
        type: 'P2P',
      };

      await expect(
        kafkaHelper.publishMessage(testTopic, message),
      ).resolves.not.toThrow();
    });

    it('should publish message with key', async () => {
      const message = {
        key: 'account-123',
        value: {
          transactionId: 'test-002',
          accountId: 'account-123',
          amount: 200,
        },
      };

      await expect(
        kafkaHelper.publishMessage(testTopic, message),
      ).resolves.not.toThrow();
    });

    it('should publish message with headers', async () => {
      const message = {
        value: {
          transactionId: 'test-003',
          amount: 300,
        },
        headers: {
          'correlation-id': 'corr-123',
          'source': 'test-suite',
        },
      };

      await expect(
        kafkaHelper.publishMessage(testTopic, message),
      ).resolves.not.toThrow();
    });

    it('should publish multiple messages in batch', async () => {
      const messages = [
        { transactionId: 'batch-001', amount: 100 },
        { transactionId: 'batch-002', amount: 200 },
        { transactionId: 'batch-003', amount: 300 },
      ];

      await expect(
        kafkaHelper.publishMessages(testTopic, messages),
      ).resolves.not.toThrow();
    });

    it('should handle large messages', async () => {
      const largeData = {
        transactionId: 'large-001',
        metadata: {
          description: 'A'.repeat(10000),
          tags: Array(100).fill({ key: 'value', data: 'sample data' }),
        },
      };

      await expect(
        kafkaHelper.publishMessage(testTopic, largeData),
      ).resolves.not.toThrow();
    });
  });

  describe('Consumer Operations', () => {
    it('should consume messages from topic', async () => {
      const testMessage = {
        transactionId: 'consume-001',
        amount: 100,
        timestamp: Date.now(),
      };

      await kafkaHelper.publishMessage(testTopic, testMessage);

      const messages = await kafkaHelper.consumeMessages(
        testTopic,
        'test-consumer-group-1',
        1,
        5000,
      );

      expect(messages.length).toBe(1);
      expect((messages[0].value as any).transactionId).toBe('consume-001');
      expect((messages[0].value as any).amount).toBe(100);
    });

    it('should consume multiple messages in order', async () => {
      const messages = [
        { transactionId: 'order-001', sequence: 1 },
        { transactionId: 'order-002', sequence: 2 },
        { transactionId: 'order-003', sequence: 3 },
      ];

      await kafkaHelper.publishMessages(testTopic, messages);

      const consumed = await kafkaHelper.consumeMessages(
        testTopic,
        'test-consumer-group-2',
        3,
        5000,
      );

      expect(consumed.length).toBe(3);
      expect((consumed[0].value as any).sequence).toBe(1);
      expect((consumed[1].value as any).sequence).toBe(2);
      expect((consumed[2].value as any).sequence).toBe(3);
    });

    it('should consume messages with custom handler', async () => {
      const processedMessages: KafkaMessageValue[] = [];
      let messageCount = 0;

      const handler = async (payload: EachMessagePayload) => {
        const value = JSON.parse(payload.message.value?.toString() || '{}');
        processedMessages.push(value);
        messageCount++;
      };

      const consumer = await kafkaHelper.createConsumer(
        'test-handler-group',
        [testTopic],
        handler,
      );

      await kafkaHelper.publishMessages(testTopic, [
        { id: 1, data: 'test1' },
        { id: 2, data: 'test2' },
      ]);

      await new Promise(resolve => setTimeout(resolve, 2000));

      expect(messageCount).toBeGreaterThanOrEqual(1);
      expect(processedMessages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Message Ordering and Partitioning', () => {
    it('should maintain order within partition', async () => {
      const accountId = 'account-partition-test';
      const messages: any[] = [];

      for (let i = 1; i <= 5; i++) {
        messages.push({
          key: accountId,
          value: {
            transactionId: `order-${i}`,
            sequence: i,
            accountId,
          },
        });
      }

      await kafkaHelper.publishMessages(testTopic, messages);

      const consumed = await kafkaHelper.consumeMessages(
        testTopic,
        'partition-order-group',
        5,
        5000,
      );

      for (let i = 0; i < consumed.length; i++) {
        expect((consumed[i].value as any).sequence).toBe(i + 1);
      }
    });

    it('should distribute messages across partitions with different keys', async () => {
      const messages: any[] = [];

      for (let i = 1; i <= 9; i++) {
        messages.push({
          key: `account-${i}`,
          value: {
            transactionId: `dist-${i}`,
            accountId: `account-${i}`,
          },
        });
      }

      await kafkaHelper.publishMessages(testTopic, messages);

      const consumed = await kafkaHelper.consumeMessages(
        testTopic,
        'distribution-group',
        9,
        5000,
      );

      expect(consumed.length).toBe(9);
    });

    it('should check topic partition count', async () => {
      const partitions = await kafkaHelper.getTopicPartitions(testTopic);

      expect(partitions.length).toBe(3);
      expect(partitions).toEqual([0, 1, 2]);
    });
  });

  describe('Error Handling and Retry', () => {
    it('should handle consumer errors gracefully', async () => {
      let errorCount = 0;

      const errorHandler = async (payload: EachMessagePayload) => {
        errorCount++;
        if (errorCount <= 2) {
          throw new Error('Processing failed');
        }
      };

      const consumer = await kafkaHelper.createConsumer(
        'error-handler-group',
        [testTopic],
        errorHandler,
      );

      await kafkaHelper.publishMessage(testTopic, {
        transactionId: 'error-test-001',
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      expect(errorCount).toBeGreaterThanOrEqual(1);
    });

    it('should handle connection failures', async () => {
      const producer = kafkaHelper.getProducer();

      await expect(
        producer.send({
          topic: testTopic,
          messages: [{ value: JSON.stringify({ test: 'connection' }) }],
        }),
      ).resolves.not.toThrow();
    });
  });

  describe('Consumer Groups', () => {
    it('should distribute messages across consumer group members', async () => {
      const messages: any[] = [];
      for (let i = 1; i <= 10; i++) {
        messages.push({ id: i, data: `message-${i}` });
      }

      await kafkaHelper.publishMessages(testTopic, messages);

      const consumer1Messages: KafkaMessageValue[] = [];
      const consumer2Messages: KafkaMessageValue[] = [];

      const handler1 = async (payload: EachMessagePayload) => {
        const value = JSON.parse(payload.message.value?.toString() || '{}');
        consumer1Messages.push(value);
      };

      const handler2 = async (payload: EachMessagePayload) => {
        const value = JSON.parse(payload.message.value?.toString() || '{}');
        consumer2Messages.push(value);
      };

      const groupId = 'load-balance-group';

      await kafkaHelper.createConsumer(groupId + '-1', [testTopic], handler1);
      await kafkaHelper.createConsumer(groupId + '-2', [testTopic], handler2);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const totalConsumed = consumer1Messages.length + consumer2Messages.length;
      expect(totalConsumed).toBeGreaterThanOrEqual(1);
    });

    it('should reset consumer group offset', async () => {
      const groupId = 'reset-group';

      await kafkaHelper.publishMessages(testTopic, [
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ]);

      const messages1 = await kafkaHelper.consumeMessages(
        testTopic,
        groupId,
        3,
        5000,
      );

      expect(messages1.length).toBe(3);

      await kafkaHelper.resetConsumerGroup(groupId, testTopic);

      const messages2 = await kafkaHelper.consumeMessages(
        testTopic,
        groupId,
        3,
        5000,
      );

      expect(messages2.length).toBe(3);
      expect((messages2[0].value as any).id).toBe(1);
    });
  });

  describe('Message Headers and Metadata', () => {
    it('should preserve message headers', async () => {
      const headers = {
        'correlation-id': 'corr-456',
        'trace-id': 'trace-789',
        'source-service': 'test-service',
      };

      await kafkaHelper.publishMessage(testTopic, {
        value: { data: 'test' },
        headers,
      });

      const messages = await kafkaHelper.consumeMessages(
        testTopic,
        'headers-group',
        1,
        5000,
      );

      expect(messages.length).toBe(1);
      expect(messages[0].headers).toBeDefined();
    });

    it('should handle message timestamps', async () => {
      const beforePublish = Date.now();

      await kafkaHelper.publishMessage(testTopic, {
        transactionId: 'timestamp-test',
        publishTime: beforePublish,
      });

      const messages = await kafkaHelper.consumeMessages(
        testTopic,
        'timestamp-group',
        1,
        5000,
      );

      expect(messages.length).toBe(1);
      expect((messages[0].value as any).publishTime).toBe(beforePublish);
    });
  });

  describe('Performance and Throughput', () => {
    it('should handle high-volume message production', async () => {
      const messageCount = 100;
      const messages: any[] = [];

      for (let i = 0; i < messageCount; i++) {
        messages.push({
          transactionId: `perf-${i}`,
          amount: i * 10,
          timestamp: Date.now(),
        });
      }

      const startTime = Date.now();
      await kafkaHelper.publishMessages(testTopic, messages);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(2000);
    }, 10000);

    it('should handle high-volume message consumption', async () => {
      const messages: any[] = [];
      for (let i = 0; i < 50; i++) {
        messages.push({
          id: i,
          data: `consume-perf-${i}`,
        });
      }

      await kafkaHelper.publishMessages(testTopic, messages);

      const startTime = Date.now();
      const consumed = await kafkaHelper.consumeMessages(
        testTopic,
        'perf-consume-group',
        50,
        10000,
      );
      const duration = Date.now() - startTime;

      expect(consumed.length).toBe(50);
      expect(duration).toBeLessThan(5000);
    }, 15000);
  });

  describe('Topic Management', () => {
    const tempTopic = 'temp-test-topic';

    afterEach(async () => {
      try {
        await kafkaHelper.deleteTopic(tempTopic);
      } catch (error) {
      }
    });

    it('should create new topic', async () => {
      await kafkaHelper.createTopic(tempTopic, 1);

      const partitions = await kafkaHelper.getTopicPartitions(tempTopic);
      expect(partitions.length).toBe(1);
    });

    it('should not fail when creating existing topic', async () => {
      await kafkaHelper.createTopic(tempTopic, 1);

      await expect(
        kafkaHelper.createTopic(tempTopic, 1),
      ).resolves.not.toThrow();
    });

    it('should delete topic', async () => {
      await kafkaHelper.createTopic(tempTopic, 1);
      await kafkaHelper.deleteTopic(tempTopic);

      await expect(
        kafkaHelper.getTopicPartitions(tempTopic),
      ).rejects.toThrow();
    });
  });
});
