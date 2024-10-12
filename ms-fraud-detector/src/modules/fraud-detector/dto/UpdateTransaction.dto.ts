import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class UpdateTransactionDto {

	@IsString()
  @IsNotEmpty()
	@ApiProperty({
    description: 'The transaction _id field',
    type: String,
  })
	transactionId: string;	
}