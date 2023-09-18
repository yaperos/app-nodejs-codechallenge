import { IsNotEmpty, IsInt, IsEnum } from 'class-validator';
enum tranferType {
  'debit' = 1,
  'credit' = 2,
}
export class CreateTransactionDto {
  @IsNotEmpty()
  accountExternalIdDebit: string;
  @IsNotEmpty()
  accountExternalIdCredit: string;
  @IsNotEmpty()
  @IsEnum(tranferType)
  tranferTypeId: number;
  @IsInt()
  @IsNotEmpty()
  value: number;
}
