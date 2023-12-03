import { ApiProperty } from '@nestjs/swagger';

export default class TypeTransactionDto {
	@ApiProperty({ type: 'string' })
	public name: string;
}
