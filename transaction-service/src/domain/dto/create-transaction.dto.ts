import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  readonly accountExternalIdDebit: string;

  @IsUUID()
  readonly accountExternalIdCredit: string;

  @Min(0.1)
  @IsNotEmpty()
  @IsNumber()
  readonly value: number;
}
