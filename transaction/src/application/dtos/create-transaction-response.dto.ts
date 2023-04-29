
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionResponseDto {
    @ApiProperty({
        type: 'string',
        example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
        required: true,
    })
    transactionExternalId: string;

    @ApiProperty({
        type: 'string',
        example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
        required: true,
    })
    accountExternalIdDebit: string;

    @ApiProperty({
        type: 'string',
        example: '34ad9b9e-e5f0-11ed-a05b-0242ac120003',
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
