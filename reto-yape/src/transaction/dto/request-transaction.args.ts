import { InputType, Field, Int, Float } from '@nestjs/graphql'

@InputType()
export class RequestTransaction {
    @Field()
    accountExternalIdDebit: string

    @Field()
    accountExternalIdCredit: string

    @Field((type) => Int)
    tranferTypeId: number

    @Field((type) => Float)
    value: number
}