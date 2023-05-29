import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TransactionStatus } from 'src/adapters/database/mongo/transactions/transactions.schema';

export class TransactionUpdateMessageDto {
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
    description: 'Status of the transaction',
  })
  @IsNotEmpty()
  @IsString()
  readonly status: TransactionStatus;
}
