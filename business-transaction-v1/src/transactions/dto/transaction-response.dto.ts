import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class TransactionResponseDto {
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

  constructor(transactionExternalId?: string) {
    this.transactionExternalId = transactionExternalId;
  }

  /**
   * Sets the transaction external ID and returns the instance for method chaining
   */
  setTransactionExternalId(transactionExternalId: string): TransactionResponseDto {
    this.transactionExternalId = transactionExternalId;
    return this;
  }
}
