
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionResponseDto {
    @ApiProperty({
        type: 'string',
        example: '9f09d5fd-4048-4e0d-83df-168ad57cdab1',
        required: true,
    })
    transactionExternalId: string;

    @ApiProperty({
        type: 'string',
        example: '9f09d5fd-4048-4e0d-83df-168ad57cdab1',
        required: true,
    })
    accountExternalIdDebit: string;

    @ApiProperty({
        type: 'string',
        example: '9f09d5fd-4048-4e0d-83df-168ad57cdab1',
        required: true,
    })
    accountExternalIdCredit: string;

    @ApiProperty({
        type: 'number',
        example: '1',
        required: true,
    })
    transferTypeId: number;

    @ApiProperty({
        type: 'number',
        example: '1',
        required: true,
    })
    value: number;


    @ApiProperty({
        type: 'number',
        example: '1',
        required: true,
    })
    status: number;


    @ApiProperty({
        type: 'number',
        example: '1',
        required: true,
    })
    createdAt: Date;
}