import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { BaseDto } from '../../../@base/base.dto';
import { TransactionStatuses, TransactionTypes } from '../types/transaction-types-enums';
import { Exclude, Expose, Transform } from 'class-transformer';

export class TransactionDto extends BaseDto {

	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	transactionExternalId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	@Exclude()
	accountExternalIdDebit: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	@Exclude()
	accountExternalIdCredit: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsEnum(TransactionTypes)
	@Exclude()
	transferTypeId: TransactionTypes;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	value: number;

	@ApiProperty()
	@IsString()
	@Expose()
	@Transform((value) => ({ name: TransactionTypes[value.obj.transferTypeId] }))
	readonly transactionType: { name: TransactionTypes };

	@ApiProperty()
	@IsString()
	@Expose()
	@Transform((value) => ({ name: TransactionStatuses[value.obj.transactionStatus] }))
	readonly transactionStatus: { name: TransactionStatuses };


	constructor(partial: Partial<TransactionDto>) {
		super();
		Object.assign(this, partial);
	}
}