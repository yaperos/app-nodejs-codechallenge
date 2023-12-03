import { ApiProperty } from '@nestjs/swagger';

export default class StatusTransactionDto {
	@ApiProperty({ type: 'string' })
	public name: string;
}
