import 'reflect-metadata';

beforeAll(async () => {
});

afterAll(async () => {
});

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn((key: string) => {
      const mockValues: Record<string, any> = {
        TRANSACTION_DB_URL: 'postgresql://test:test@localhost:5432/test',
        ANTIFRAUD_DB_URL: 'postgresql://test:test@localhost:5432/test',
        KAFKA_BROKER: 'localhost:9092',
        OTEL_ENABLED: 'false',
        REDIS_URL: 'redis://localhost:6379',
      };
      return mockValues[key];
    }),
  })),
}));

jest.mock('kafkajs');
jest.mock('drizzle-orm');
jest.mock('ioredis');

jest.mock('pino', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    child: jest.fn(() => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    })),
  })),
}));
