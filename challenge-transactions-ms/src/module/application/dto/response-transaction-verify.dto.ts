import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class TransactionType {
  @ApiProperty({ example: 'deposit', type: 'string' })
  readonly name: string;

  @ApiProperty({ example: '1', type: 'number' })
  readonly id: number;
}
class TransactionStatus {
  @ApiProperty({ example: 'PENDING', type: 'string' })
  readonly name: string;

  @ApiProperty({ example: '1', type: 'number' })
  readonly id: number;
}
class ResponseTransactionVerify {
  @ApiProperty({
    example: 'fff529b4-d459-4d05-bc8f-d6a4852e276d',
    type: 'string',
  })
  readonly transactionExternalId: string;

  @ApiProperty({
    example: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
    type: 'string',
  })
  readonly accountExternalIdDebit: string;

  @ApiProperty({
    example: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
    type: 'string',
  })
  readonly accountExternalIdCredit: string;

  @ApiProperty({ example: '120', type: 'number' })
  readonly value: number;

  @Type(() => TransactionType)
  @ApiProperty({ type: TransactionType })
  readonly transactionType: TransactionType;

  @Type(() => TransactionStatus)
  @ApiProperty({ type: TransactionStatus })
  readonly transactionStatus: TransactionStatus;

  @ApiProperty({ example: '2023-08-21T13:44:49.942Z', type: 'string' })
  readonly createdAt: string;

  @ApiProperty({ example: '2023-08-21T13:44:49.942Z', type: 'string' })
  readonly updatedAtStatus: string;
}

export class TransactionVerifyResponseDto {
  @Type(() => ResponseTransactionVerify)
  @ApiProperty({ type: ResponseTransactionVerify, isArray: false })
  data: ResponseTransactionVerify;

  @ApiProperty({ type: 'string', example: 'Success' })
  message: string;
}
