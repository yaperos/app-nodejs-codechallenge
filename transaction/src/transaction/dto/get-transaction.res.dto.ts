import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Transaction } from '../entities/transaction.entity';
import StatusTransactionDto from './status-transaction.dto';
import TypeTransactionDto from './type-transaction.dto';

export class GetTransactionResponseDto {
	@ApiProperty({ type: 'varchar', example: '4be6ea87-e2a4-11ed-85ea-0603ea229325' })
	public transactionExternalId: string;

	@ApiProperty({ type: TypeTransactionDto })
	@Type(() => TypeTransactionDto)
	public transactionType: TypeTransactionDto;

	@ApiProperty({ type: StatusTransactionDto })
	@Type(() => StatusTransactionDto)
	public transactionStatus: StatusTransactionDto;

	@ApiProperty({ type: 'number', example: 120 })
	public value: number;

	@ApiProperty({ type: 'datetime' })
	public createdAt: Date;

	constructor(transaction: Transaction) {
		this.transactionExternalId = transaction.transactionExternalId;
		this.transactionType = { name: transaction.transactionType };
		this.transactionStatus = { name: transaction.transactionStatus };
		this.value = transaction.value;
		this.createdAt = transaction.createdAt;
	}
}
