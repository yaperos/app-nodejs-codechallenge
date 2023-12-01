import { ObjectType, Field } from '@nestjs/graphql'
import { Transaction } from 'src/core/transaction/query'
import { DeleteTransactionResponse, SearchTransactionsResponse } from 'src/core/transaction/response'
import { Pagination } from 'src/core/utils/response'

@ObjectType()
export class TransactionConnection {
    @Field(type => [Transaction])
    transactions: Transaction[]

    @Field(type => Pagination)
    pagination: Pagination

    static of(
        transactionConnectionBody: Partial<TransactionConnection>
    ): TransactionConnection {
        const transactionConnection = new TransactionConnection()

        Object.assign(transactionConnection, transactionConnectionBody)

        return transactionConnection
    }

    static fromApiResponse(searchResponse: SearchTransactionsResponse): TransactionConnection {
        
        return TransactionConnection.of({
            transactions: searchResponse.transactions
                ? searchResponse.transactions.map(Transaction.fromRawTransaction)
                : [],
            pagination: searchResponse.pagination
                ? Pagination.fromRawPagination(searchResponse.pagination)
                : { total_items: 0, total_pages: 1, page: 1 },
        })
    }

    static empty(): TransactionConnection {
        return TransactionConnection.of({
            transactions: [],
            pagination: { total_items: 0, total_pages: 1, page: 1 },
        })
    }
}



@ObjectType()
export class DeleteTransactionPayload {
    @Field(type => [String], { nullable: true })
    errors?: string[]

    @Field(type => Transaction, { nullable: true })
    transaction?: Transaction

    static fromApiResponse(
        apiResponse: DeleteTransactionResponse
    ): DeleteTransactionPayload {
        const payload = new DeleteTransactionPayload()

        if (apiResponse.error) {
            payload.errors = [apiResponse.error.detail]
        } else {
            payload.transaction = Transaction.fromRawTransaction(apiResponse.transaction)
        }

        return payload
    }
}
