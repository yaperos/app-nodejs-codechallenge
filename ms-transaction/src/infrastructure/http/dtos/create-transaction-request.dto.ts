import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  ISaveTransactionRequest,
  TransferType,
} from '../../../domain/interfaces/transaction.interface';

export class CreateTransactionDto implements ISaveTransactionRequest {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly accountExternalName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsEnum(TransferType, { each: true })
  readonly transferTypeName: TransferType;
}
