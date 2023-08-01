import { KafkaPayload } from './anti-fraud.entities';

export abstract class AntiFraudPort {
  public abstract returnTransactionEvaluated(data: KafkaPayload): Promise<void>;
  public abstract returnErrorTransactionEvaluated(data: KafkaPayload): Promise<void>;
}
