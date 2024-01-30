import { ApiProperty } from "@nestjs/swagger"
import { Transaction } from "../../domain/transaction"

export class TransactionUpdatedResponse {
    @ApiProperty({
        description: "Id transaction",
        example: "d28beff0-c093-48a7-b88c-59458ec74d1c"
    })
    transactionId: string

    @ApiProperty({
        description: "Status of transaction",
        example: "APPROVED"
    })
    status: string
}
