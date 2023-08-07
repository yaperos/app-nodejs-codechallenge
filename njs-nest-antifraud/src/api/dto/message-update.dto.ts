import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageUpdateDTO {
	constructor(partial?: Partial<MessageUpdateDTO>) {
		Object.assign(this, partial);
	}

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
