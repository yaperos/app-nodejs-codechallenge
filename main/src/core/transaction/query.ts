import { Field, ObjectType } from '@nestjs/graphql'
import { CreateTransactionResponse } from './response';
import { TransactionStatus } from '@prisma/client';

@ObjectType()
export class Transaction {
    @Field()
    id: number;

    @Field()
    accountExternalIdDebit: string

    @Field()
    accountExternalIdCredit: string

    @Field()
    tranferTypeId: number

    @Field()
    status: TransactionStatus

    @Field()
    value: number

    @Field()
    isDeleted: boolean

    @Field()
    createdAt: number

    @Field()
    updatedAt: number

    static of(body: Partial<Transaction>): Transaction {
        const query = new Transaction()

        Object.assign(query, body)

        return query
    }

    static fromRawTransaction(data: any): Transaction {
        return Transaction.of(data)
    }
}

@ObjectType()
export class CreateTransactionPayload {
    @Field(type => [String], { nullable: true })
    errors?: string[]

    @Field(type => Transaction, { nullable: true })
    transaction?: Transaction

    static fromApiResponse(
        apiResponse: CreateTransactionResponse
    ): CreateTransactionPayload {
        const payload = new CreateTransactionPayload()

        if (apiResponse.error) {
            payload.errors = [apiResponse.error.detail]
        } else {
            payload.transaction = Transaction.fromRawTransaction(apiResponse.transaction)
        }

        return payload
    }
}

export class CreateTransactionQuery {
    account_external_id_debit: string
    account_external_id_credit: string
    tranfer_type_id: number
    value: number
}

export class SearchTransactionQuery {
    page?: number
    limit?: number
    ids?: number[]
    status?: TransactionStatus[]
}

export interface Pagination {
    total_items: number
    total_pages: number
    page: number
}

export interface TransactionMsg {
    id: number;
    status: TransactionStatus
}