// CreateTransactionDto;
// with this one from njs-nest-transaction/src/api/dto/create-transaction.dto.ts:
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

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

@InputType()
export class CreateTransactionGrqphQL {
	@Field({ nullable: true })
	accountExternalIdDebit: string;

	@Field({ nullable: true })
	accountExternalIdCredit: string;

	@Field(() => Int)
	tranferTypeId: number;

	@Field(() => Int)
	value: number;
}
