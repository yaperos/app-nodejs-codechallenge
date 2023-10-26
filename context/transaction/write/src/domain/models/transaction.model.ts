import { Exclude, Expose } from "class-transformer";

export class TransactionModel {
  @Expose()
  id: string;

  @Exclude()
  accountExternalIdDebit: string;

  @Exclude()
  accountExternalIdCredit: string;

  @Expose()
  transferTypeId: number;

  @Expose()
  status: string;

  @Expose()
  value: number;

  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
