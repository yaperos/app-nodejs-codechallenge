import { IsNotEmpty, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class TransactionInterfaceRequest {
  @IsUUID()
  @IsOptional()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsOptional()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  tranferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class TransactionInterface {
  type: number;
  status: number;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
  transactionExternalId: string;
}
