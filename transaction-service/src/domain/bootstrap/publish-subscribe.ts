import { TransactionId } from "../entities/value-objects/transaction-id";
import { TransactionValidated } from "../events/transaction-validated";
import { publisherSubscriberService } from "./services";

export const StartPublisherSubscriberService = () => {
  publisherSubscriberService.addListenerForConsume((message: string) => {
    const body = JSON.parse(message);

    new TransactionValidated(
      body.status,
      new TransactionId(body.transaction_id),
    ).dispatch();
  });
  publisherSubscriberService.consume();
};
