import { TransferType } from 'src/domain/models';

export class CreateTransactionCommand {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly tranferTypeId: TransferType,
    public readonly value: number,
  ) {}
}
