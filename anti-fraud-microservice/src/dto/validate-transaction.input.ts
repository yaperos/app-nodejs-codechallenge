import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ValidateTransactionDto {
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	readonly id: string;

	@IsNumber()
	@IsNotEmpty()
	readonly v: number;
}