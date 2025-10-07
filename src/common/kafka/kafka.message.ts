export interface KafkaMessage {
  transactionExternalId: string;
  value: number;
  transactionStatus: {
    name: 'pendiente' | 'aprobado' | 'rechazado';
  };
  createdAt: string;
}
