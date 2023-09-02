import Transaction from "../models/Transaction";


async function reviewTransaction(transactionId: string) {
  const transaction = await Transaction.query().findById(transactionId);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (transaction.value > 1000) {
    // TO-DO transaction rejected event
  } else {
    // TO-DO transaction accepted event
  }
}


export default {
  reviewTransaction,
}