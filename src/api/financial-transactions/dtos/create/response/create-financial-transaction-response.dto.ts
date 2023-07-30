import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateFinancialTransactionResponse {
  @ApiProperty({ type: String, description: 'The transaction description' })
  @Expose()
  description: string;

  @ApiProperty({ type: String, description: 'The transaction status' })
  @Expose()
  status: string;

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
