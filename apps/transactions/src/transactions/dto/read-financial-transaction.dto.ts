import { ApiProperty } from '@nestjs/swagger';
import { Named } from '@/transactions/interfaces/named.interface';

export class ReadFinancialTransactionDTO {
  @ApiProperty({
    description: 'GUID generated by the Anti-fraud microservice',
  })
  transactionExternalId: string;

  @ApiProperty({
    description: 'Yape or Plin Transaction',
  })
  transactionType: Named;

  @ApiProperty({
    description: 'The current status of the transaction',
  })
  transactionStatus: Named;

  @ApiProperty({
    description: 'The given ammount for the transaction',
  })
  value: number;

  @ApiProperty({
    description: 'Auto-generated date when the tramnsaction was created',
  })
  createdAt: Date;
}
