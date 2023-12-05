import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../entities/transaction.entity';

export class CreateTransactionResponseDto {
	@ApiProperty({ type: 'number', example: 11 })
	public id: number;

	@ApiProperty({ type: 'string', example: 'transaction-0004' })
	public transactionExternalId: string;

	@ApiProperty({ type: 'number', example: 1 })
	public transactionStatusId: number;

	constructor(transaction: Transaction) {
		this.id = transaction.id;
		this.transactionExternalId = transaction.transactionExternalId;
		this.transactionStatusId = transaction.transactionStatusId;
	}
}
