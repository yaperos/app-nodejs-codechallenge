import { AppService } from './app.service';

describe('AppService', () => {
  it('should default port to 3000', () => {
    delete process.env.PORT;
    expect(AppService.port).toEqual(3000);
  });

  it('should default database_port to 3306', () => {
    delete process.env.DATABASE_PORT;
    expect(AppService.database_port).toEqual(3306);
  });

  it('should default database_host to "localhost', () => {
    delete process.env.DATABASE_HOST;
    expect(AppService.database_host).toEqual('localhost');
  });

  it('should default database_user to "sergio', () => {
    delete process.env.DATABASE_USER;
    expect(AppService.database_user).toEqual('sergio');
  });

  it('should default database_pass to "12345', () => {
    delete process.env.DATABASE_PASS;
    expect(AppService.database_pass).toEqual('12345');
  });

  it('should default database_name to "retodb', () => {
    delete process.env.DATABASE_NAME;
    expect(AppService.database_name).toEqual('retodb');
  });

  it('should default mongo_user to "sergio', () => {
    delete process.env.MONGO_USER;
    expect(AppService.mongo_user).toEqual('sergio');
  });

  it('should default mongo_port to 27017', () => {
    delete process.env.MONGO_PORT;
    expect(AppService.mongo_port).toEqual(27017);
  });

  it('should default mongo_host to "localhost', () => {
    delete process.env.MONGO_HOST;
    expect(AppService.mongo_host).toEqual('localhost');
  });

  it('should default mongo_pass to "12345', () => {
    delete process.env.MONGO_PASS;
    expect(AppService.mongo_pass).toEqual('12345');
  });

  it('should default mongo_name to "retodb', () => {
    delete process.env.MONGO_NAME;
    expect(AppService.mongo_name).toEqual('retodb');
  });

  it('should default kafka_broker to "localhost:9092', () => {
    delete process.env.KAFKA_BROKER;
    expect(AppService.kafka_broker).toEqual('localhost:9092');
  });

  it('should default kafka_topic to "transaction"', () => {
    delete process.env.KAFKA_TOPIC;
    expect(AppService.kafka_topic).toEqual('transaction');
  });

  it('should default kafka_topic_status to "transaction-status"', () => {
    delete process.env.KAFKA_TOPIC_STATUS;
    expect(AppService.kafka_topic_status).toEqual('transaction-status');
  });
});
