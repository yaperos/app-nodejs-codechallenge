import { ApiProperty } from "@nestjs/swagger";

export class UpdateTransactionResponse{
    @ApiProperty({
        type: String,
        example: 'transaction updated',
        required: true,
    })
    message: string;
}