import { Transaction as ObjectTransaction } from "src/objects/transaction";
import { Transaction as EntityTransaction } from "src/entities/transaction.entity";

export const MOCK_TRANSACTION_ID = "73671875-0556-45ab-9af6-70f38ffaba9d";
export const MOCK_TRANSACTION_ORM_RESPONSE = {
  accountExternalIdCredit: "dummyCreditId",
  accountExternalIdDebit: "dummyDebitId",
  id: "MOCK_TRANSACTION_ID",
  updatedAt: new Date("2019-04-07T10:20:30Z"),
  createdAt: new Date("2019-04-07T10:20:30Z"),
  status: "dummyStatus",
  type: "dummyType",
  value: 1500,
} as EntityTransaction;

export const MOCK_TRANSACTION_RESULT = {
  transactionExternalId: "MOCK_TRANSACTION_ID",
  transactionStatus: {
    name: "dummyStatus",
  },
  transactionType: {
    name: "dummyType",
  },
  value: 1500,
  updatedAt: new Date("2019-04-07T10:20:30Z").toISOString(),
  createdAt: new Date("2019-04-07T10:20:30Z").toISOString(),
} as ObjectTransaction;

export const MOCK_TRANSACTION_INPUT = {
  accountExternalIdCredit: "string",
  accountExternalIdDebit: "string",
  transferTypeId: 1,
  value: 1,
};
