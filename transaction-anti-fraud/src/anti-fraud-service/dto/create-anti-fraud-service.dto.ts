import { ITransaction } from "../entities/transaction.service.entity";

export class CreateAntiFraudServiceDto implements ITransaction{
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  transactionExternalId: string;
  transactionType: string;
  transactionStatus: string;
}
