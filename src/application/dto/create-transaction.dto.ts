import { IsEnum, IsNumber, IsString, IsOptional, IsUUID, Min, Max, IsObject, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../../domain/entities/transaction.entity';

export class CreateTransactionDto {
  @ApiPropertyOptional({
    description: 'External transaction ID from client system',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  externalId?: string;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.P2P,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction amount',
    minimum: 0.01,
    maximum: 10000,
    example: 100.50,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(10000)
  amount: number;

  @ApiPropertyOptional({
    description: 'Currency code (ISO 4217)',
    default: 'PEN',
    example: 'PEN',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  currency?: string;

  @ApiProperty({
    description: 'Source account identifier (phone number or account ID)',
    example: '+51999888777',
  })
  @IsString()
  @Matches(/^(\+?[1-9]\d{8,14}|[A-Z0-9]{8,20})$/, {
    message: 'Invalid source account format',
  })
  sourceAccountId: string;

  @ApiProperty({
    description: 'Target account identifier (phone number or account ID)',
    example: '+51999888666',
  })
  @IsString()
  @Matches(/^(\+?[1-9]\d{8,14}|[A-Z0-9]{8,20})$/, {
    message: 'Invalid target account format',
  })
  targetAccountId: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the transaction',
    example: {
      description: 'Payment for dinner',
      category: 'food',
      location: 'Lima, Peru',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, string | number | boolean>;

  @ApiPropertyOptional({
    description: 'Idempotency key to prevent duplicate transactions',
    example: 'unique-key-12345',
  })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}