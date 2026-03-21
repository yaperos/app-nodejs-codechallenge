import { IsEnum, IsPositive, IsUUID } from 'class-validator';

export enum TransferType {
  TRANSFER = 1,
  PAYMENT = 2,
  REFUND = 3,
  WITHDRAWAL = 4
}

export class CreateTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsEnum(TransferType)
  tranferTypeId: number;

  @IsPositive()
  value: number
}