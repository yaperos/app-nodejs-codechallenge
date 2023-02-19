import { Status } from "../entities/status";
import { Transaction } from "../entities/transaction";
import { AccountExternalId } from "../entities/value-objects/account-external-id";
import { TransactionId } from "../entities/value-objects/transaction-id";
import { TransferTypeId } from "../entities/value-objects/transfer-type-id";

export interface TransactionService {
  create(
    accountExternalIdDebit: AccountExternalId,
    accountExternalIdCredit: AccountExternalId,
    tranferTypeId: TransferTypeId,
    value: number
  ): Promise<Transaction>;

  updateStatus(id: TransactionId, status: Status): Promise<void>;

  getById(id: TransactionId): Promise<Transaction>;
}

export interface PublisherSubscriberService {
  emit(value: string): Promise<void>;
  consume(): void;
  addListenerForConsume(callback: (message: string) => void): void;
}
