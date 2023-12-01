import { Field, ArgsType, Int } from '@nestjs/graphql'
import { Expose, Type } from 'class-transformer'
import { ValidateNested, IsDefined, Min } from 'class-validator'
import { CreateTransactionInput, SearchTransactionsQuery } from './input'

@ArgsType()
export class CreateTransactionArgs {
    @Field(type => CreateTransactionInput)
    @Type(type => CreateTransactionInput)
    @ValidateNested()
    input: CreateTransactionInput
}

@ArgsType()
export class RetrieveTransactionArgs {
    @Field(type => Int)
    @IsDefined()
    id: number
}

@ArgsType()
export class DeleteTransactionArgs {
    @Field(type => Int)
    @IsDefined()
    id: number
}

@ArgsType()
export class SearchTransactionsArgs {
    @Field(type => Int, { nullable: true, name: 'page' })
    @Expose({ name: 'page' })
    @Min(0)
    page?: number

    @Field(type => Int, { nullable: true, name: 'limit' })
    @Expose({ name: 'limit' })
    @Min(1)
    limit?: number

    @Field(type => SearchTransactionsQuery, { nullable: true })
    @Type(type => SearchTransactionsQuery)
    @ValidateNested()
    query: SearchTransactionsQuery
}