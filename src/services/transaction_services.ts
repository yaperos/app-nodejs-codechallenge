import Transaction from "../models/Transaction";
import { Guid } from "guid-typescript";
import { sendEvent } from "../events";
import Event from "../models/Event";

async function getTransactionById(id: string) {
  return await Transaction.query().findById(id);
}

async function getAllTransactions() {
  return await Transaction.query();
}

async function createTransaction({ input }: { input: Transaction.InputData }): Promise<Transaction> {

  const transaction = await Transaction.query().insert({
    id: Guid.create().toString(),
    accountExternalIdDebit: input.accountExternalIdDebit,
    accountExternalIdCredit: input.accountExternalIdCredit,
    transferTypeId: input!.transferTypeId,
    value: input!.value,
    status: Transaction.Status.PENDING,
  });

  await sendEvent({
    type: Event.Type.NEW_TRANSACTION,
    value: {
      transactionId: transaction.id,
    }
  })

  return transaction;

};


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
  getTransactionById,
  getAllTransactions,
  createTransaction,
  updateTransactionStatus,
  // TO-DO batchCreateTransactions,
}