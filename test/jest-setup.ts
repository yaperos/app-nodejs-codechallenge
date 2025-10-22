jest.setTimeout(30000);

process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'yape_user';
process.env.DB_PASSWORD = 'yape_password123';
process.env.DB_DATABASE = 'yape_transactions';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.KAFKA_BROKERS = 'localhost:9092';
process.env.KAFKA_CLIENT_ID = 'test-client';
process.env.KAFKA_CONSUMER_GROUP_ID = 'test-group';