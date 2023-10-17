import { IsNumber, IsString } from 'class-validator';
export class CreateTransactionDto {
  @IsString()
  readonly accountExternalIdDebit: string;

  @IsString()
  readonly accountExternalIdCredit: string;

  @IsNumber()
  readonly tranferTypeId: number;

  @IsNumber()
  readonly value: number;
}
