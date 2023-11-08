import { IsUUID, /* IsNotEmpty, */ IsNumber, Min, Max } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsNumber()
  transferTypeId: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  value: number;
}
