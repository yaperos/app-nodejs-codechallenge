import { Kafka, Producer, Consumer, KafkaConfig } from 'kafkajs';

const {
  KAFKA_HOST = 'localhost',
  KAFKA_PORT = 9092,
  KAFKA_CLIENT_ID = 'client-id',
} = process.env;

let params: KafkaConfig = {
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
  clientId: KAFKA_CLIENT_ID,
};

if (process.env.KAFKA_AUTH === 'SASL') {
  const KAFKA_USERNAME = process.env.KAFKA_USERNAME;
  const KAFKA_PASSWORD = process.env.KAFKA_PASSWORD;  
  Object.assign(params,{
    ssl: true,
    sasl: {
      mechanism: 'plain', // scram-sha-256 or scram-sha-512
      username: KAFKA_USERNAME,
      password: KAFKA_PASSWORD,
    },
  });
};

export default class Provider {
  private static client: Kafka;

  private constructor() {};

  public static getClient(): Kafka {
    if (!Provider.client) Provider.client = new Kafka(params);
    
    return Provider.client;
  };
};