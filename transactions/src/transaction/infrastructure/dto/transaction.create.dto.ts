import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID('4', { message: 'accountExternalIdDebit debe ser UID tipo 4' })
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID('4', { message: 'accountExternalIdCredit debe ser UID tipo 4' })
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  tranferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
