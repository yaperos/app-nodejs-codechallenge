import { AccountExternalIdCredit } from 'src/transactions/domain/AccountExternalIdCredit';
import { AccountExternalIdDebit } from 'src/transactions/domain/AccountExternalIdDebit';
import { TransferTypeId } from 'src/transactions/domain/TransferTypeId';

export class CreateTransactionCommand {
  constructor(
    public accountExternalIdDebit: AccountExternalIdDebit,
    public accountExternalIdCredit: AccountExternalIdCredit,
    public transferTypeId: TransferTypeId,
    public value: number,
  ) {}
}
