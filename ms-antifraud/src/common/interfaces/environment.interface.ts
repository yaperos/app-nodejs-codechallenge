export interface Environment {
  apiPort: number;
  environment: string;
  database: DataBaseConfig;
  kafka: KafkaConfig;
  antifraudKafka: KafkaConfig,
}

export interface KafkaConfig {
  host: string;
  name: string;
  clientId: string;
  groupId: string;
}

export interface DataBaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}