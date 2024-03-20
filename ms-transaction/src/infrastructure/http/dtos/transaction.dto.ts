import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  TransferStatus,
  TransferType,
} from '../../../../src/domain/interfaces/transaction.interface';

export class TransactionDto {
  @IsNotEmpty()
  @IsString()
  public id?: string;

  @IsNotEmpty()
  @IsDecimal()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  public externalId: string;

  @IsNotEmpty()
  @IsString()
  public accountExternalName?: string;

  @IsOptional()
  @IsString()
  @IsEnum(TransferType, { each: true })
  public transferTypeName: TransferType;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TransferStatus, { each: true })
  public status: TransferStatus;

  @IsNotEmpty()
  @IsString()
  public createdAt: Date;

  @IsOptional()
  @IsString()
  public updatedAt?: Date;
}
