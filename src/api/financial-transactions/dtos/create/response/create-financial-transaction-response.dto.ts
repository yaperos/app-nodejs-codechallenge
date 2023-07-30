import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class TransactionStatus {
  @ApiProperty({ type: String, description: 'The transaction status' })
  @Expose()
  name: string;
}

export class TransactionType {
  @ApiProperty({ type: String, description: 'The transaction type' })
  @Expose()
  name: string;
}

export class CreateFinancialTransactionResponse {
  @ApiProperty({ description: 'Transaction code', type: String })
  @Expose()
  transactionExternalId: string;

  @ApiProperty({ description: 'Transaction type data', type: TransactionType })
  @Expose()
  @Type(() => TransactionType)
  transactionType: TransactionType;

  @ApiProperty({ description: 'Transaction status data', type: TransactionStatus })
  @Expose()
  @Type(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @ApiProperty({ type: Number, description: 'The transaction value' })
  @Expose()
  value: number;

  @ApiProperty({ type: String, description: 'The transaction date' })
  @Expose()
  createdAt: string;

  @ApiProperty({ type: Number, description: 'The transaction id' })
  @Expose()
  transactionId: number;
}

export class CreateFinancialTransactionError {
  @ApiProperty({ type: Number, description: 'The status error code' })
  @Expose()
  statusCode: number;

  @ApiProperty({ type: String, description: 'The error message' })
  @Expose()
  message: string;

  @ApiProperty({ type: String, description: 'The error type' })
  @Expose()
  error: string;
}

export class CreateFinancialTransactionWithErrorsResponse {
  @ApiProperty({ type: CreateFinancialTransactionError, isArray: true })
  errors: CreateFinancialTransactionError[];
}
