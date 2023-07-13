import { ApiProperty } from '@nestjs/swagger';

export class GetTransactionDto {
  @ApiProperty({ format: 'uuid' })
  transactionExternalId: string;

  @ApiProperty()
  transactionType: {
    name: string;
  };

  @ApiProperty()
  transactionStatus: {
    name: string;
  };

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;
}
