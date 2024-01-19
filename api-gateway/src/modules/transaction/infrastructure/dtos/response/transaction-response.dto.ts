import { ApiProperty } from '@nestjs/swagger';
import { TransactionOutput as ITransactionOutput } from 'src/modules/transaction/domain/providers/transaction-client.provider';

class TransactionTypeDto {
  @ApiProperty({
    type: String,
    example: 'WITHDRAWAL',
    nullable: false,
  })
  name: string;
}

class TransactionStatusDto {
  @ApiProperty({
    type: String,
    example: 'pending',
    nullable: false,
  })
  name: string;
}

export class TransactionResponseDto implements ITransactionOutput {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Guid',
    example: '03ddb592-5559-412d-9792-abf3c0f5ba69',
    nullable: false,
    uniqueItems: true,
  })
  transactionExternalId: string;

  @ApiProperty({
    type: TransactionTypeDto,
    nullable: false,
  })
  transactionType: TransactionTypeDto;

  @ApiProperty({
    type: TransactionStatusDto,
    nullable: false,
  })
  transactionStatus: TransactionStatusDto;

  @ApiProperty({
    type: 'number',
    format: 'float',
    description: 'amount',
    example: 424.25,
    nullable: false,
  })
  value: number;

  @ApiProperty({
    type: Date,
    example: '2024-04-15T01:35:51.908Z',
    nullable: false,
  })
  createdAt: string;
}
