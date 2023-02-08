import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionResponseDto {
  @ApiProperty({
    description: 'Transaction id',
    type: String,
    example: 'cbc722da-0dea-42c0-82a4-444a50ae7764',
  })
  id: string;

  @ApiProperty({
    description: 'Status',
    type: String,
    example: 'approved',
  })
  status: string;

  @ApiProperty({
    description: 'Created date',
    type: String,
    example: '2023-02-08T16:40:38.153Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated date',
    type: String,
    example: '2023-02-08T16:40:38.153Z',
  })
  updatedAt: Date;
}
