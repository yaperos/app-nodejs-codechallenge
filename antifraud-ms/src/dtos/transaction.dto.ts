import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class TransactionDto {
  
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;
  
  @IsNotEmpty()
  @IsUUID()
  readonly accountExternalIdDebit: string;
  
  @IsNotEmpty()
  @IsUUID()
  readonly accountExternalIdCredit: string;
  
  @IsNotEmpty()
  @IsUUID()
  readonly status: string;
  
  @IsNotEmpty()
  @IsNumber()
  readonly tranferTypeId: number;
  
  @IsNotEmpty()
  @IsNumber()
  readonly value: number;
}

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
