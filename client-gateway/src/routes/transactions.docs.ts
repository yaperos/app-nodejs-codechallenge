import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDocDto {
    @ApiProperty({ format: 'uuid' })
    accountExternalIdDebit!: string;

    @ApiProperty({ format: 'uuid' })
    accountExternalIdCredit!: string;

    @ApiProperty({ example: 1 })
    tranferTypeId!: number;

    @ApiProperty({ example: 120, description: 'Valores mayores a 1000 serán rechazados por el antifraude' })
    value!: number;
}

export class TransactionDocDto {
    @ApiProperty({ format: 'uuid' })
    transactionExternalId!: string;

    @ApiProperty({ example: { name: 'TRANSFER' } })
    transactionType!: { name: string };

    @ApiProperty({ example: { name: 'pending' } })
    transactionStatus!: { name: string };

    @ApiProperty({ example: 120 })
    value!: number;

    @ApiProperty({ format: 'date-time' })
    createdAt!: string;
}