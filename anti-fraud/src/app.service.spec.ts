import { AppService } from './app.service';

describe('AppService', () => {
  it('should return the port from environment variables or default value', () => {
    process.env.PORT = '3000';
    expect(AppService.port).toEqual(3000);

    delete process.env.PORT;
    expect(AppService.port).toEqual(4000);
  });

  it('should return the Kafka broker from environment variables or default value', () => {
    process.env.KAFKA_BROKER = 'test-broker';
    expect(AppService.kafka_broker).toEqual('test-broker');

    delete process.env.KAFKA_BROKER;
    expect(AppService.kafka_broker).toEqual('localhost:9092');
  });

  it('should return the Kafka topic from environment variables or default value', () => {
    process.env.KAFKA_TOPIC = 'test-topic';
    expect(AppService.kafka_topic).toEqual('test-topic');

    delete process.env.KAFKA_TOPIC;
    expect(AppService.kafka_topic).toEqual('transaction');
  });

  it('should return the Kafka topic status from environment variables or default value', () => {
    process.env.KAFKA_TOPIC_STATUS = 'test-topic-status';
    expect(AppService.kafka_topic_status).toEqual('test-topic-status');

    delete process.env.KAFKA_TOPIC_STATUS;
    expect(AppService.kafka_topic_status).toEqual('transaction-status');
  });

  it('should return the max value from environment variables or default value', () => {
    process.env.VALUE_MAX = '500';
    expect(AppService.value_max).toEqual(500);

    delete process.env.VALUE_MAX;
    expect(AppService.value_max).toEqual(1000);
  });
});
