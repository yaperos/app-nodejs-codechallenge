import { Status } from "../entities/status";
import { Transaction } from "../entities/transaction";
import { AccountExternalId } from "../entities/value-objects/account-external-id";
import { TransactionId } from "../entities/value-objects/transaction-id";
import { TransferTypeId } from "../entities/value-objects/transfer-type-id";

export interface TransactionRepository {
  create(
    accountExternalIdDebit: AccountExternalId,
    accountExternalIdCredit: AccountExternalId,
    tranferTypeId: TransferTypeId,
    value: number,
  ): Promise<Transaction>;

  getById(id: TransactionId): Promise<Transaction>;

  updateStatus(id: TransactionId, status: Status): Promise<void>;
}
