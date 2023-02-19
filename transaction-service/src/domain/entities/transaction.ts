import { Status } from "./status";
import { AccountExternalId } from "./value-objects/account-external-id";
import { TransactionId } from "./value-objects/transaction-id";
import { TransferTypeId } from "./value-objects/transfer-type-id";

export class Transaction {
  constructor(
    public readonly id: TransactionId,
    public readonly accountExternalIdDebit: AccountExternalId,
    public readonly accountExternalIdCredit: AccountExternalId,
    public readonly tranferTypeId: TransferTypeId,
    public readonly value: number,
    public readonly status: Status,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
