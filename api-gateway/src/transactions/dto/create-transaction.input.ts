import { ObjectType, Field, Int, InputType } from "@nestjs/graphql";
import { Transfertype } from "../../transfertypes/entities/transfertype.entity";

@InputType()
export class CreateTransactionInput {

    @Field()
    accountExternalIdDebit: string;

    @Field()
    accountExternalIdCredit: string;

    @Field( type => Int )
    value: number;

    @Field()
    transactionTypeId: number;

    @Field({ defaultValue: 1})
    transactionStatusId: number;

    @Field({defaultValue: new Date()})
    createdAt: Date
}