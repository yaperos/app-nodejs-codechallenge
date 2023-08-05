// CreateTransactionDto;
// with this one from njs-nest-transaction/src/api/dto/create-transaction.dto.ts:
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	accountExternalIdDebit: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	accountExternalIdCredit: string;

	@ApiProperty()
	@IsNumber()
	tranferTypeId: number;

	@ApiProperty()
	@IsNumber()
	value: number;
}

