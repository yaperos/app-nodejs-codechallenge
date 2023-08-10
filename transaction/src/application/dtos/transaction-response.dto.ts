import { Transaction } from '../../domain/aggregates/transaction';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionCreateResponse {
  @ApiProperty({
    type: 'string',
    example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
    description: 'account external debit id',
    required: true,
  })
  accountExternalIdDebit: string;

  @ApiProperty({
    type: 'string',
    example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
    description: 'account external credit id',
    required: true,
  })
  accountExternalIdCredit: string;

  @ApiProperty({
    type: 'number',
    example: '1',
    description: 'trander type id',
    required: true,
  })
  tranferTypeId: number;

  @ApiProperty({
    type: 'number',
    example: '1',
    description: 'amount of transaction',
    required: true,
  })
  value: number;
}

export class TransactionResponseDto {
  static fromDomainToResponse(transaction: Transaction) {
    return {
      transactionExternalId: transaction.properties().transactionExternalId,
      accountExternalIdDebit: transaction.properties().accountExternalIdDebit,
      accountExternalIdCredit: transaction.properties().accountExternalIdCredit,
      tranferTypeId: transaction.properties().tranferTypeId,
      value: transaction.properties().value,
      status: transaction.properties().status,
    };
  }
}
