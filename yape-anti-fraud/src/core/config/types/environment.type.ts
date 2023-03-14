export type Environment = {
  kafkaHost: string;
  kafkaGroupId: string;
  transactionLimit: number;
  transactionKafkaConfig: TransactionKafkaConfig;
};

export type TransactionKafkaConfig = {
  host: string;
  name: string;
  clientId: string;
  groupId: string;
};
