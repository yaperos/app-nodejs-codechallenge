// CreateTransactionDto;
// with this one from njs-nest-transaction/src/api/dto/create-transaction.dto.ts:
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

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


@InputType()
export class CreateTypeGraphQL {
	@Field()
	name: string;

	@Field()
	numericId: number;

	@Field({ nullable: true })
	typeExternalId?: string;
}