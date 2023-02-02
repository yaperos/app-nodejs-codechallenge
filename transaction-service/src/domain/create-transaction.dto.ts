import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  readonly accountExternalIdDebit: string;

  @IsUUID()
  readonly accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsNumber()
  readonly value: number;
}
