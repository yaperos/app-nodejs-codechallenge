import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  accountExternalIdDebit: string;

  @IsString()
  accountExternalIdCredit: string;

  @IsNumber()
  transferTypeId: number;

  @IsNumber()
  value: number;
}
