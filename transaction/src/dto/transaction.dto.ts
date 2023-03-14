import { ApiProperty } from '@nestjs/swagger';

export class NameAttribute {
  constructor(name: string) {
    this.name = name;
  }

  @ApiProperty()
  name: string;
}

export class TransactionDto {
  @ApiProperty()
  transactionExternalId: string;

  @ApiProperty()
  transactionType: NameAttribute;

  @ApiProperty()
  transactionStatus: NameAttribute;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: string;
}
