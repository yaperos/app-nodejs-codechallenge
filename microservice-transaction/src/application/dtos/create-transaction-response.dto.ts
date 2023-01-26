import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionResponse{
    @ApiProperty({
        type: String,
        description: 'Transaction external id',
        example: 'd6f8a6f0-5b8d-4b9c-8c9a-1b5b9b9b9b9b',
        required: true,
    })
    transactionExternalId: string;
    @ApiProperty({
        type: String,
        example: 'transaction created',
        required: true,
    })
    message: string;
}