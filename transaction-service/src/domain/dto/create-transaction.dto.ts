import { IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  readonly accountExternalIdDebit: string;

  @IsUUID()
  readonly accountExternalIdCredit: string;

  @IsInt()
  readonly tranferTypeId: number;

  @Min(0.1)
  @IsNotEmpty()
  @IsNumber()
  readonly value: number;
}
