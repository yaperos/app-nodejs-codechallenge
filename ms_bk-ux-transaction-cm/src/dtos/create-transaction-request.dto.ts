import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTransactionRequestDto {
  @IsString()
  @IsUUID(4)
  accountExternalIdDebit: string;

  @IsString()
  @IsUUID(4)
  accountExternalIdCredit: string;

  @IsNumber()
  value: number;

  @IsNumber()
  transferTypeId: number;
}
