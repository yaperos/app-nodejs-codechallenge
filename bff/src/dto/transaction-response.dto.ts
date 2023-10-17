import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponse {
  @ApiProperty({ example: '0b07c362-5536-4626-9b30-07b837f2a693' })
  transactionExternalId: string;

  @ApiProperty({
    example: {
      transactionType: {
        name: 'regular',
      },
    },
  })
  transactionType: {
    name: string;
  };

  @ApiProperty({
    example: {
      transactionStatus: {
        name: 'pending',
      },
    },
  })
  transactionStatus: {
    name: string;
  };

  @ApiProperty({ example: 2000 })
  value: number;

  @ApiProperty({ example: '2023-10-17T04:40:22.557Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-17T04:40:22.557Z' })
  updtedAt: string;
}
