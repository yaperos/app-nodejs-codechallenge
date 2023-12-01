import { Field, ObjectType } from '@nestjs/graphql'
import { CreateTransferResponse } from './response';

@ObjectType()
export class Transfer {
    @Field()
    id: number;

    @Field()
    name: string

    @Field()
    isDeleted: boolean

    static of(body: Partial<Transfer>): Transfer {
        const query = new Transfer()

        Object.assign(query, body)

        return query
    }

    static fromRawTransfer(data: any): Transfer {
        return Transfer.of(data)
    }
}

@ObjectType()
export class CreateTransferPayload {
    @Field(type => [String], { nullable: true })
    errors?: string[]

    @Field(type => Transfer, { nullable: true })
    transfer?: Transfer

    static fromApiResponse(
        apiResponse: CreateTransferResponse
    ): CreateTransferPayload {
        const payload = new CreateTransferPayload()

        if (apiResponse.error) {
            payload.errors = [apiResponse.error.detail]
        } else {
            payload.transfer = Transfer.fromRawTransfer(apiResponse.transfer)
        }

        return payload
    }
}

export class CreateTransferQuery {
    name: string
}

export class SearchTransferQuery {
    page?: number
    limit?: number
    ids?: number[]
    names?: string[]
}

export interface Pagination {
    total_items: number
    total_pages: number
    page: number
}