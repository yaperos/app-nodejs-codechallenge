import { ProducerRecord } from "kafkajs";
import { ITransactionAntiFraudResponseHandler } from "../../handler";

export interface IEventService {
  setupEvents(dependencies: dependencies): Promise<void>;
  sendEvent(record: ProducerRecord): Promise<void>;
}

export type dependencies = {
  transactionAntiFraudResponseHandler: ITransactionAntiFraudResponseHandler;
};
