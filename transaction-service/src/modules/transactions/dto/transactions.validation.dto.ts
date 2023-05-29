import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class TransactionValidationMessageDto {
  @ApiProperty({
    type: String,
    description: 'transactionId of the transaction',
    default: 'uuid of transaction',
  })
  @IsNotEmpty()
  @IsUUID()
  transactionId: string;

  @ApiProperty({
    type: String,
    description: 'Value of the transaction',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly value: number;
}
