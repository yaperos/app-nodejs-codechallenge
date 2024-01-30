import { Decimal } from '@prisma/client/runtime/library';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateInternalTransactionDto {
  @IsString()
  @IsNotEmpty()
  debitAccountId: string;

  @IsString()
  @IsNotEmpty()
  creditAccountId: string;

  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  value: Decimal;

  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  tranferTypeId: number;
}

export class CreateExternalTransactionDto {
  @IsString()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsString()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  value: Decimal;

  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  tranferTypeId: number;
}
