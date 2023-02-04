import { Int, Field, Float, ObjectType} from '@nestjs/graphql';
@ObjectType()
export class TransactionEntity {


    @Field(()  => String)
    accountExternalIdDebit: string

    @Field(()  => String)
    accountExternalIdCredit: string

    @Field(()  => Int, { nullable: true})
    transferTypeId: number | null

    @Field(()  => Float )
    value: number

    @Field(()  => String )
    transactionExternalId?: string

}