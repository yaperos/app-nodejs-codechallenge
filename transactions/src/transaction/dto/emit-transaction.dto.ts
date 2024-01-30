import { Decimal } from '@prisma/client/runtime/library';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class EmitTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  amount: Decimal;
}
