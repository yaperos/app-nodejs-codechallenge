import { Decimal } from '@prisma/client/runtime/library';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class EditBalanceDto {
  @IsString()
  @IsNotEmpty()
  balanceId?: string;

  @IsString()
  @IsNotEmpty()
  currency?: string;

  @Min(0)
  @IsOptional()
  @IsNumber()
  amount?: Decimal;
}
