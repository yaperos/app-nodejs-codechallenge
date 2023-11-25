import { IsNumber, IsString, IsUUID } from 'class-validator';

export class TransaccionDto {
  @IsUUID()
  transactionId: string;

  @IsString()
  accountExternalIdDebit: string;

  @IsString()
  accountExternalIdCredit: string;

  @IsNumber()
  transferTypeId: number;

  @IsNumber()
  value: number;
}
