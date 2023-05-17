
export interface ITransaction {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  transactionExternalId: string;
  transactionType: string;
  transactionStatus: string;
  createdAt?: Date;
}

export class CreateAntiFraudServiceDto implements ITransaction{
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  transactionExternalId: string;
  transactionType: string;
  transactionStatus: string;
  createdAt?: Date;
}
