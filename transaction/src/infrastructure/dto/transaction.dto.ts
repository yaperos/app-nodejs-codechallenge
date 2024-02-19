import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateTransactionRequest {
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsIn([1, 2], { message: 'transferTypeId must be either 1 or 2.' })
  transferTypeId: number;

  @Min(1)
  value: number;
}

export class TransactionType {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class TransactionStatus {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GetTransactionResponse {
  @IsUUID()
  transactionExternalId: string;

  @IsNotEmptyObject()
  @IsDefined()
  @Type(() => TransactionType)
  @ValidateNested()
  transactionType: TransactionType;

  @IsNotEmptyObject()
  @IsDefined()
  @Type(() => TransactionStatus)
  @ValidateNested()
  transactionStatus: TransactionStatus;

  @IsNumber()
  @Min(1)
  value: number;

  @IsDate()
  createdAt: Date;
}
