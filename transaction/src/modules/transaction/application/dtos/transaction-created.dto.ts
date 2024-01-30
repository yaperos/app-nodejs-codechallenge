import { ApiProperty } from "@nestjs/swagger"
import { Transaction } from "../../domain/transaction"

export class TransactionCreatedResponse {
    @ApiProperty({
        description: "Id transaction",
        example: "d28beff0-c093-48a7-b88c-59458ec74d1c"
    })
    transactionId: string

    @ApiProperty({
        description: "Status of transaction",
        example: "PENDING"
    })
    status: string
}
export class TransactionCreated {
    static fromDomainToResponse(transaction: Transaction): TransactionCreatedResponse {
        const response = new TransactionCreatedResponse()
        response.transactionId = transaction.properties.transactionId
        response.status = transaction.properties.status

        return response
    }
}