import { IsInt, IsPositive, IsUUID, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsInt()
  @IsPositive()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  value: number;

  // toString() {
  //   return JSON.stringify({
  //     accountExternalIdDebit: this.accountExternalIdDebit,
  //     accountExternalIdCredit: this.accountExternalIdCredit,
  //     tranferTypeId: this.tranferTypeId,
  //     value: this.value,
  //   });
  // }
}
