import { IsInt, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class TransactionDto {
  @IsUUID()
  readonly accountExternalIdDebit: string;

  @IsUUID()
  readonly accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsInt()
  readonly tranferTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly value: number;
}
