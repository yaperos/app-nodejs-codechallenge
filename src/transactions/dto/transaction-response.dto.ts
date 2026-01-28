import { ApiProperty } from '@nestjs/swagger';

class TransactionType {
  @ApiProperty()
  name: string;
}

class TransactionStatus {
  @ApiProperty()
  name: string;
}

export class TransactionResponseDto {
  @ApiProperty({ description: 'ID único de la transacción' })
  transactionExternalId: string;

  @ApiProperty({ type: TransactionType })
  transactionType: TransactionType;

  @ApiProperty({ type: TransactionStatus })
  transactionStatus: TransactionStatus;

  @ApiProperty({ description: 'Valor de la transacción' })
  value: number;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;
}