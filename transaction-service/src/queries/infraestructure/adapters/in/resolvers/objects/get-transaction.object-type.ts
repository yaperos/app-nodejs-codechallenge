import { Field, Int, ObjectType } from "@nestjs/graphql";
import { TransactionStatusObjectType } from "./transaction-status.object-type";
import { TransactionTypeObjectType } from "./transaction-type.object-type";

@ObjectType()
export class GetTransactionObjectType {
    @Field(type => String)
    transactionExternalId: string;

    @Field(type => String)
    accountExternalIdDebit: string;

    @Field(type => String)
    accountExternalIdCredit: string;

    @Field(type => Int)
    tranferTypeId: number;

    @Field(type => TransactionStatusObjectType, { nullable: true })
    transactionType: TransactionTypeObjectType;

    @Field(type => TransactionStatusObjectType, { nullable: true })
    transactionStatus: TransactionStatusObjectType;

    @Field(type => Int)
    value: number;

    @Field(type => Date)
    createdAt: Date;
}