import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ErrorTransactionsDto {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'statusCode', default: 403 })
  readonly statusCode: number;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'error',
    default: 'Forbidden',
  })
  readonly error: string;
}
