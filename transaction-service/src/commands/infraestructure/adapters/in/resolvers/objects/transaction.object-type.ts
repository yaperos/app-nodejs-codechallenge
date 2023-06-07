import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionObjectType {
    @Field(type => String)
    transactionExternalId: string;

    @Field(type => String)
    accountExternalIdDebit: string;

    @Field(type => String)
    accountExternalIdCredit: string;

    @Field(type => Int)
    tranferTypeId: number;

    @Field(type => Int)
    value: number;
}