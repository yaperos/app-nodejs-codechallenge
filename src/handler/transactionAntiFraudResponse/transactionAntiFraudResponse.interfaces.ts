import { KafkaMessage } from "kafkajs";

export interface ITransactionAntiFraudResponseHandler {
  processAntiFraudResponse(message: KafkaMessage): Promise<void>;
}
