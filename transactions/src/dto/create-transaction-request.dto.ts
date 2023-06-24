import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionRequestDto {
  @IsString()
  @IsOptional()
  accountExternalIdDebit?: string;
  @IsString()
  @IsOptional()
  accountExternalIdCredit?: string;
  @IsNumber()
  transferTypeId: number;
  @IsNumber()
  value: number;
}
