import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';
import { TransactionsDto } from './transactions.dto';

export class TransactionsResponseDto extends TransactionsDto {
  @ApiProperty({
    type: String,
    description: 'transactionExternalId of the transaction',
    default: '630aeeb06997b40d6907c6c0',
  })
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;

  @ApiProperty({
    type: String,
    description: 'Mongo id',
    default: '630aeeb06997b40d6907c6c0',
  })
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiProperty({
    type: Date,
    description: 'Date of the transaction',
    default: '2021-05-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Date of the transaction',
    default: '2021-05-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  updatedAt: Date;
}
