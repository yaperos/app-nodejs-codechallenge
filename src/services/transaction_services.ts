import Transaction from "../models/Transaction";
import { Guid } from "guid-typescript";
import { batchSendEvents, sendEvent } from "../events";
import Event from "../models/Event";

async function getTransactionById(id: string) {
  return await Transaction.query().findById(id);
}

async function getAllTransactions() {
  return await Transaction.query();
}

async function getTransactionsByIds({ transactionIds }: { transactionIds: string[] }) {
  return await Transaction.query().findByIds(transactionIds);
}

async function createTransaction({ input }: { input: Transaction.InputData }): Promise<Transaction> {

  const transaction = await Transaction.query().insert({
    id: Guid.create().toString(),
    accountExternalIdDebit: input.accountExternalIdDebit,
    accountExternalIdCredit: input.accountExternalIdCredit,
    transferTypeId: input.transferTypeId,
    value: input.value,
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

async function batchCreateTransactions({ input }: { input: Transaction.InputData[] }): Promise<Transaction[]> {
  const eventsData: {type: Event.Type, value: Event.Data}[] = [];
  const transactions = await Promise.all(
    input.map(async data => {
      const transaction = await Transaction.query().insert({
        id: Guid.create().toString(),
        accountExternalIdDebit: data.accountExternalIdDebit,
        accountExternalIdCredit: data.accountExternalIdCredit,
        transferTypeId: data.transferTypeId,
        value: data.value,
        status: Transaction.Status.PENDING,
      });

      eventsData.push({
        type: Event.Type.NEW_TRANSACTION,
        value: {
          transactionId: transaction.id,
        }
      });

      return transaction;

    })
  );

  // Send events in a single batch
  await batchSendEvents(eventsData);

  return transactions;
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
  getTransactionById,
  getAllTransactions,
  getTransactionsByIds,
  createTransaction,
  batchCreateTransactions,
  updateTransactionStatus,
}