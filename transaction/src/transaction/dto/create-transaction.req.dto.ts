import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionRequestDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'varchar', example: '4be6ea87-e2a4-11ed-85ea-0603ea229325' })
	public accountExternalIdDebit: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'varchar', example: '4be6ea87-e2a4-11ed-85ea-0603ea229326' })
	public accountExternalIdCredit: string;

	@IsNotEmpty()
	@ApiProperty({ type: 'int', example: 1 })
	public transferTypeId: number;

	@IsNotEmpty()
	@ApiProperty({ type: 'numeric', example: 120 })
	public value: number;
}
