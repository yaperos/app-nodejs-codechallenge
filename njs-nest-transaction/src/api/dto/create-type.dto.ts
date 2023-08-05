// CreateTransactionDto;
// with this one from njs-nest-transaction/src/api/dto/create-transaction.dto.ts:
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTypeDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsNumber()
	numericId: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	typeExternalId?: string;
}

