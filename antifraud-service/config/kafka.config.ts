const broker = process.env.KAFKA_HOST_URL || 'localhost:9092';
const clientId = process.env.KAFKA_CLIENT_ID || 'KAFKA_CLIENT_ID';

export const kafkaConfig = {
  clientId,
  brokers: [broker],
};
