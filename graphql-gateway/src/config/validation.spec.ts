import { configValidationSchema } from './validation';
import { ValidationError } from 'joi';

describe('configValidationSchema', () => {
  it('should validate environment variables correctly', () => {
    const env = {
      NODE_ENV: 'development',
      KAFKA_BROKER_0: 'localhost:9092',
      KAFKA_CLIENT_ID_CONSUMER: 'test-consumer',
      KAFKA_CLIENT_ID_PRODUCER: 'test-producer',
      KAFKA_GROUP_ID: 'test-group',
      CACHE_URL: 'redis://localhost:6379',
      CACHE_TTL: 3600,
    };

    const { error } = configValidationSchema.validate(env);

    expect(error).toBeUndefined();
  });

  it('should throw error if a required variable is missing', () => {
    const invalidEnv = {
      // Missing KAFKA_CLIENT_ID_CONSUMER
      KAFKA_BROKER_0: 'localhost:9092',
      KAFKA_CLIENT_ID_PRODUCER: 'test-producer',
      KAFKA_GROUP_ID: 'test-group',
      CACHE_URL: 'redis://localhost:6379',
      CACHE_TTL: 3600,
    };

    const { error } = configValidationSchema.validate(invalidEnv);

    expect(error).toBeDefined();
    expect(error?.message).toContain('KAFKA_CLIENT_ID_CONSUMER');
  });

  it('should allow NODE_ENV to be omitted and use default', () => {
    const env = {
      KAFKA_BROKER_0: 'broker',
      KAFKA_CLIENT_ID_CONSUMER: 'c1',
      KAFKA_CLIENT_ID_PRODUCER: 'p1',
      KAFKA_GROUP_ID: 'group',
      CACHE_URL: 'redis://localhost:6379',
      CACHE_TTL: 3600,
    };

    const { error, value } = configValidationSchema.validate(env) as {
      error: ValidationError;
      value: Record<string, string>;
    };

    expect(error).not.toBeDefined();
    expect(value.NODE_ENV).toBe('development');
  });
});
