import { Field, ArgsType, Int } from '@nestjs/graphql'
import { Expose, Type } from 'class-transformer'
import { ValidateNested, IsDefined, Min } from 'class-validator'
import { CreateTransferInput, SearchTransfersQuery } from './input'

@ArgsType()
export class CreateTransferArgs {
    @Field(type => CreateTransferInput)
    @Type(type => CreateTransferInput)
    @ValidateNested()
    input: CreateTransferInput
}

@ArgsType()
export class DeleteTransferArgs {
    @Field(type => Int)
    @IsDefined()
    id: number
}

@ArgsType()
export class SearchTransfersArgs {
    @Field(type => Int, { nullable: true, name: 'page' })
    @Expose({ name: 'page' })
    @Min(0)
    page?: number

    @Field(type => Int, { nullable: true, name: 'limit' })
    @Expose({ name: 'limit' })
    @Min(1)
    limit?: number

    @Field(type => SearchTransfersQuery, { nullable: true })
    @Type(type => SearchTransfersQuery)
    @ValidateNested()
    query: SearchTransfersQuery
}