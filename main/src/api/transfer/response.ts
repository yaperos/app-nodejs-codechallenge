import { ObjectType, Field } from '@nestjs/graphql'
import { Transfer } from 'src/core/transfer/query'
import { DeleteTransferResponse, SearchTransfersResponse } from 'src/core/transfer/response'
import { Pagination } from 'src/core/utils/response'

@ObjectType()
export class TransferConnection {
    @Field(type => [Transfer])
    transfers: Transfer[]

    @Field(type => Pagination)
    pagination: Pagination

    static of(
        transactionConnectionBody: Partial<TransferConnection>
    ): TransferConnection {
        const transactionConnection = new TransferConnection()

        Object.assign(transactionConnection, transactionConnectionBody)

        return transactionConnection
    }

    static fromApiResponse(searchResponse: SearchTransfersResponse): TransferConnection {
        return TransferConnection.of({
            transfers: searchResponse.transfers
                ? searchResponse.transfers.map(Transfer.fromRawTransfer)
                : [],
            pagination: searchResponse.pagination
                ? Pagination.fromRawPagination(searchResponse.pagination)
                : { total_items: 0, total_pages: 1, page: 1 },
        })
    }

    static empty(): TransferConnection {
        return TransferConnection.of({
            transfers: [],
            pagination: { total_items: 0, total_pages: 1, page: 1 },
        })
    }
}



@ObjectType()
export class DeleteTransferPayload {
    @Field(type => [String], { nullable: true })
    errors?: string[]

    @Field(type => Transfer, { nullable: true })
    transfer?: Transfer

    static fromApiResponse(
        apiResponse: DeleteTransferResponse
    ): DeleteTransferPayload {
        const payload = new DeleteTransferPayload()

        if (apiResponse.error) {
            payload.errors = [apiResponse.error.detail]
        } else {
            payload.transfer = Transfer.fromRawTransfer(apiResponse.transfer)
        }

        return payload
    }
}
