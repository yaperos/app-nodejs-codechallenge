import Transaction from "../models/Transaction";
import Event from "../models/Event";
import { sendEvent } from "../events";

async function reviewTransaction(transactionId: string) {
  const transaction = await Transaction.query().findById(transactionId);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (transaction.value > 1000) {
    sendEvent({
      type: Event.Type.TRANSACTION_REJECTED,
      value: {
        transactionId,
      }
    });
  } else {
    sendEvent({
      type: Event.Type.TRANSACTION_ACCEPTED,
      value: {
        transactionId,
      }
    });
  }
}


export default {
  reviewTransaction,
}