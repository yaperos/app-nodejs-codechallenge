import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  transactionStatusId: number;
}
