import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageUpdateDTO {
	@IsString()
	@IsOptional()
	readonly id: string;

	@IsString()
	@IsOptional()
	readonly status: string;

	@IsNumber()
	@IsOptional()
	readonly value: number;
}
