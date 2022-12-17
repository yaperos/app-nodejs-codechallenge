import { IsString, IsUUID } from 'class-validator';

export class TransactionCreationRequestDto {
  value: number;

  @IsUUID()
  @IsString()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsString()
  accountExternalIdCredit: string;

  transferTypeId: number;
}
