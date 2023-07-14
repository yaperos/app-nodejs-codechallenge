import { IsDefined, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  transferTypeId: number;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
