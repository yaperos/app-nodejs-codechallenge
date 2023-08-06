import { Field, InputType, Int } from '@nestjs/graphql';
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
