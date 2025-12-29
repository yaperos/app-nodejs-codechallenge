import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID() accountExternalIdDebit: string;
  @IsUUID() accountExternalIdCredit: string;

  @IsInt() tranferTypeId: number;

  @IsInt()
  @Min(0)
  value: number;
}
