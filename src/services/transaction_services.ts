import Transaction from "../models/Transaction";


async function createTransaction({
  accountExternalIdDebit,
  accountExternalIdCredit,
  transferType,
  value,
}: {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferType: number;
  value: number;
}): Promise<Transaction> {

  const transaction = Transaction.query().insert({
    accountExternalIdDebit,
    accountExternalIdCredit,
    transferType,
    value,
    status: Transaction.Status.PENDING,
  });

  // TO-DO send transaction created event, pass in transaction id

  return transaction;

};


async function getTransactionById(id: string) {
  return await Transaction.query().findById(id);
}


async function updateTransactionStatus({
  id,
  status,
}: {
  id: string;
  status: Transaction.Status;
}): Promise<Transaction> {

  return await Transaction.query().patchAndFetchById(id, { status });

}



export default {
  createTransaction,
  getTransactionById,
  updateTransactionStatus,
  // TO-DO batchCreateTransactions,
}