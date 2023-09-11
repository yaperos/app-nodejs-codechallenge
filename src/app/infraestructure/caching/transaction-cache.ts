export class TransactionCache {
  readonly id: number;
  readonly accountExternalIdCredit: string;
  readonly accountExternalIdDebit: string;
  readonly transactionExternalId: string;
  readonly value: number;
  readonly status: string;
  readonly transferTypeId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly transferType: TransferType;
}

class TransferType {
  id: number;
  name:string;
}
