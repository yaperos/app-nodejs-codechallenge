import { ApiProperty } from '@nestjs/swagger';
export class TransactionResponseDto {
  transactionExternalId: string;
  transactionType: {
    name: number;
  };
  transactionStatus: {
    name: string;
  };
  value: number;
  createdAt: Date;
}

export class TransactionCreateResponse {
  @ApiProperty({
    type: 'string',
    example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
    description: 'Account External Debit Id',
    required: true,
  })
  accountExternalIdDebit: string;

  @ApiProperty({
    type: 'string',
    example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
    description: 'Account External Credit Id',
    required: true,
  })
  accountExternalIdCredit: string;

  @ApiProperty({
    type: 'number',
    example: '1',
    description: 'Type Id',
    required: true,
  })
  tranferTypeId: number;

  @ApiProperty({
    type: 'number',
    example: '1',
    description: 'Amount Transaction',
    required: true,
  })
  value: number;
}
