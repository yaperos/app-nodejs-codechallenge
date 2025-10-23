import { AccountExternalIdCredit } from 'src/transactions/domain/AccountExternalIdCredit';
import { AccountExternalIdDebit } from 'src/transactions/domain/AccountExternalIdDebit';
import { TransactionExternalId } from 'src/transactions/domain/TransactionExternalId';
import { TransactionId } from 'src/transactions/domain/TransactionId';
import { TransactionStatus } from 'src/transactions/domain/TransactionStatus';
import { TransactionType } from 'src/transactions/domain/TransactionType';
import { TransferTypeId } from 'src/transactions/domain/TransferTypeId';

export interface TransactionPrimitives {
  uuid: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  transactionExternalId: string;
  transactionType: { name: string };
  transactionStatus: { name: string };
  value: number;
}
export class Transaction {
  constructor(
    private uuid: TransactionId,
    private accountExternalIdDebit: AccountExternalIdDebit,
    private accountExternalIdCredit: AccountExternalIdCredit,
    private transferTypeId: TransferTypeId,
    private transactionExternalId: TransactionExternalId,
    private transactionType: TransactionType,
    private transactionStatus: TransactionStatus,
    private value: number,
  ) {}

  toPrimitives(): TransactionPrimitives {
    return {
      uuid: this.uuid.value,
      accountExternalIdDebit: this.accountExternalIdDebit.value,
      accountExternalIdCredit: this.accountExternalIdCredit.value,
      transferTypeId: this.transferTypeId.value,
      transactionExternalId: this.transactionExternalId.value,
      transactionType: { name: this.transactionType.name },
      transactionStatus: { name: this.transactionStatus.name },
      value: this.value,
    };
  }
}
