import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNumber, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionTypeResponseDto, TransactionStatusResponseDto } from './transaction-nested.dto';

export class GetTransactionResponseDto {
  @ApiProperty({
    name: 'transactionExternalId',
    description: 'ID externo asignado a la transacción.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsUUID(4, { message: 'transactionExternalId must be a valid UUID' })
  transactionExternalId?: string;

  @ApiProperty({
    name: 'transactionType',
    description: 'Tipo de transacción',
    type: TransactionTypeResponseDto,
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionTypeResponseDto)
  transactionType?: TransactionTypeResponseDto;

  @ApiProperty({
    name: 'transactionStatus',
    description: 'Estado de la transacción',
    type: TransactionStatusResponseDto,
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionStatusResponseDto)
  transactionStatus?: TransactionStatusResponseDto;

  @ApiProperty({
    name: 'amount',
    description: 'Valor monetario de la transacción.',
    example: 100.50,
    type: 'number',
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'amount must be a number with at most 2 decimal places' })
  amount?: number;

  @ApiProperty({
    name: 'createdAt',
    description: 'Fecha y hora en que se creó la transacción.',
    example: '2025-07-13T10:30:00.000Z',
    format: 'date-time',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'createdAt must be a valid ISO 8601 date string' })
  createdAt?: Date;

  @ApiProperty({
    name: 'updatedAt',
    description: 'Fecha y hora en que se actualizó la transacción.',
    example: '2025-07-13T10:35:00.000Z',
    format: 'date-time',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'updatedAt must be a valid ISO 8601 date string' })
  updatedAt?: Date;

  constructor(
    transactionExternalId?: string,
    transactionType?: TransactionTypeResponseDto,
    transactionStatus?: TransactionStatusResponseDto,
    amount?: number,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.transactionExternalId = transactionExternalId;
    this.transactionType = transactionType;
    this.transactionStatus = transactionStatus;
    this.amount = amount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Sets the transaction external ID and returns the instance for method chaining
   */
  setTransactionExternalId(transactionExternalId: string): GetTransactionResponseDto {
    this.transactionExternalId = transactionExternalId;
    return this;
  }

  /**
   * Sets the transaction type and returns the instance for method chaining
   */
  setTransactionType(transactionType: TransactionTypeResponseDto): GetTransactionResponseDto {
    this.transactionType = transactionType;
    return this;
  }

  /**
   * Sets the transaction status and returns the instance for method chaining
   */
  setTransactionStatus(transactionStatus: TransactionStatusResponseDto): GetTransactionResponseDto {
    this.transactionStatus = transactionStatus;
    return this;
  }

  /**
   * Sets the amount and returns the instance for method chaining
   */
  setAmount(amount: number): GetTransactionResponseDto {
    this.amount = amount;
    return this;
  }

  /**
   * Sets the created at date and returns the instance for method chaining
   */
  setCreatedAt(createdAt: Date): GetTransactionResponseDto {
    this.createdAt = createdAt;
    return this;
  }

  /**
   * Sets the updated at date and returns the instance for method chaining
   */
  setUpdatedAt(updatedAt: Date): GetTransactionResponseDto {
    this.updatedAt = updatedAt;
    return this;
  }
}
