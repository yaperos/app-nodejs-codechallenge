import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../entities/transaction.entity';

export class CreateTransactionResponseDto {
	@ApiProperty({ type: 'string', example: '4be6ea87-e2a4-11ed-85ea-0603ea229325' })
	public transactionExternalId: string;

	@ApiProperty({ type: 'string', example: 'pending' })
	public transactionStatus: string;

	constructor(transaction: Transaction) {
		this.transactionExternalId = transaction.transactionExternalId;
		this.transactionStatus = transaction.transactionStatus.name;
	}
}
