import { OutboxPublisher } from './outbox.publisher';
import { ConfigService } from '@nestjs/config';
import { OutboxRepository } from '@ports/out/outbox-repository';
import { EventPublisher } from '@ports/out/event-publisher';
import { OutboxMessage } from '@domain/outbox';

describe('OutboxPublisher', () => {
  let configService: jest.Mocked<ConfigService>;
  let outboxRepository: jest.Mocked<OutboxRepository>;
  let eventPublisher: jest.Mocked<EventPublisher>;
  let publisher: OutboxPublisher;

  const configValues: Record<string, unknown> = {
    'outbox.pollIntervalMs': 2000,
    'outbox.batchSize': 50,
    'outbox.maxAttempts': 5,
    'outbox.baseRetryDelayMs': 1000,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    configService = {
      get: jest.fn((key: string, defaultValue?: unknown) =>
        (key in configValues ? configValues[key] : defaultValue),
      ),
    } as unknown as jest.Mocked<ConfigService>;

    outboxRepository = {
      enqueue: jest.fn(),
      dequeueBatch: jest.fn(),
      markPublished: jest.fn(),
      markFailed: jest.fn(),
      withGlobalAdvisoryLock: jest.fn(),
    } as unknown as jest.Mocked<OutboxRepository>;

    eventPublisher = {
      publishOutboxMessage: jest.fn(),
      publishStatusChanged: jest.fn(),
    } as unknown as jest.Mocked<EventPublisher>;

    publisher = new OutboxPublisher(configService, outboxRepository, eventPublisher);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const invokeProcessOnce = () => (publisher as unknown as { processOnce: () => Promise<void> }).processOnce();

  it('publishes messages and marks them as published', async () => {
    const message: OutboxMessage = {
      id: 'msg-1',
      topic: 'topic',
      key: 'key',
      payload: { foo: 'bar' },
      attempts: 0,
      nextAttemptAt: new Date(),
    };

    outboxRepository.withGlobalAdvisoryLock.mockImplementation(async (_lock, task) => task());
    outboxRepository.dequeueBatch.mockResolvedValue([message]);

    await invokeProcessOnce();

    expect(eventPublisher.publishOutboxMessage).toHaveBeenCalledWith(message);
    expect(outboxRepository.markPublished).toHaveBeenCalledWith('msg-1');
    expect(outboxRepository.markFailed).not.toHaveBeenCalled();
  });

  it('marks message as failed with backoff when publish throws', async () => {
    const message: OutboxMessage = {
      id: 'msg-2',
      topic: 'topic',
      key: 'key',
      payload: { foo: 'bar' },
      attempts: 0,
      nextAttemptAt: new Date(),
    };

    outboxRepository.withGlobalAdvisoryLock.mockImplementation(async (_lock, task) => task());
    outboxRepository.dequeueBatch.mockResolvedValue([message]);
    const error = new Error('network');
    eventPublisher.publishOutboxMessage.mockRejectedValue(error);

    await invokeProcessOnce();

    expect(outboxRepository.markFailed).toHaveBeenCalledTimes(1);
    const [id, attempts, nextAttemptAt] = outboxRepository.markFailed.mock.calls[0];
    expect(id).toBe('msg-2');
    expect(attempts).toBe(1);
    expect(nextAttemptAt.getTime()).toBe(new Date('2025-01-01T00:00:01.000Z').getTime());
    expect(outboxRepository.markPublished).not.toHaveBeenCalled();
  });
});
