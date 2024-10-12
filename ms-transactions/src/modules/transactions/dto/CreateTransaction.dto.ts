import { ApiProperty } from '@nestjs/swagger';
import {IsInt, IsNotEmpty, IsString, IsUUID} from 'class-validator';

export class CreateTransactionDto {

	@IsString()
  @IsNotEmpty()
	@ApiProperty({
    description: 'The external debit account Id',
    type: String,
    format: 'uuid',
  })
	accountExternalIdDebit: string;

	@IsString()
  @IsNotEmpty()
	@ApiProperty({
    description: 'The external credit account Id',
    type: String,
    format: 'uuid',
  })
	accountExternalIdCredit: string;

	@IsInt()
	@ApiProperty({
    description: 'The transfer type ID',
    type: Number,
    example: 1,
  })
  tranferTypeId: number;

	@IsInt()
	@ApiProperty({
    description: 'The transaction amount',
    type: Number,
    example: 126,
  })
	value: number;
	
}