import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageCreateDTO {
	@IsString()
	@IsOptional()
	id: string;

	@IsString()
	@IsOptional()
	accountExternalIdDebit: string;

	@IsString()
	@IsOptional()
	accountExternalIdCredit: string;

	@IsNumber()
	@IsOptional()
	tranferTypeId: number;

	@IsNumber()
	@IsOptional()
	value: number;
}
