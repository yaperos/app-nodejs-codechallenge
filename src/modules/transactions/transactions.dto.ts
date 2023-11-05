import {
  IsUUID,
  IsNumber,
  IsString,
  IsDate,
  IsNotEmpty,
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
