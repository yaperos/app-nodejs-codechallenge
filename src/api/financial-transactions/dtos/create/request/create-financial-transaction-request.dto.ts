import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Type } from '../../../../../domain/_shared/constants/transaction-type.enum';
import { Expose } from 'class-transformer';

export class CreateFinancialTransactionRequest {
  @ApiProperty({ description: 'The transaction value ' })
  @IsNumber()
  @Expose()
  value: number;

  @ApiProperty({ enum: Type, description: 'The transaction type' })
  @IsEnum(Type)
  @Expose()
  transactionType: Type;
}
