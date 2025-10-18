import type { TransactionCreatedEvent, TransactionStatusEvent } from "../../messaging/events.js";
import { HIGH_VALUE_THRESHOLD } from "../../constants/transactions.js";

export const evaluateTransaction = (
  event: TransactionCreatedEvent
): TransactionStatusEvent => {
  const status = event.value > HIGH_VALUE_THRESHOLD ? "rejected" : "approved";

  return {
    transactionExternalId: event.transactionExternalId,
    status,
    processedAt: new Date().toISOString()
  };
};
