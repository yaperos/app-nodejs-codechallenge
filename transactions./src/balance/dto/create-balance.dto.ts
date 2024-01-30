import { Decimal } from '@prisma/client/runtime/library';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBalanceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Min(0)
  @IsOptional()
  @IsNumber()
  amount?: Decimal;
}
