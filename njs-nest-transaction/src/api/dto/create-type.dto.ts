import { Field, InputType } from '@nestjs/graphql';
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


@InputType()
export class CreateTypeGraphQL {
	@Field()
	name: string;

	@Field()
	numericId: number;

	@Field({ nullable: true })
	typeExternalId?: string;
}