import {
  IsUUID,
  IsNumber,
  IsString,
  IsDate,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;
  @IsNotEmpty()
  @IsNumber()
  tranferTypeId: number;
  @IsOptional()
  @IsString()
  tranferTypeName: string;
  @IsNotEmpty()
  @IsNumber()
  value: number;
}

export class TransactionDto {
  @IsUUID()
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  @IsNotEmpty()
  @IsNumber()
  value: number;
  @IsNotEmpty()
  @IsDate()
  createdAt: string | Date;
  @IsOptional()
  @IsDate()
  updatedAt: string | Date;
}

class TransactionType {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
}

class TransactionStatus {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class TransactionEntityDto {
  transaction_external_id: string;
  transaction_type_id: number;
  transaction_type_name: string;
  transaction_status: string;
  value: number;
}
