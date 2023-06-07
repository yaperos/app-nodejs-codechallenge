import { Field, InputType, Int } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType()
export class NewTransactionInputType {
    @Field(type => String)
    @IsUUID('all', { message: 'Invalid accountExternalIdDebit uuid' })
    readonly accountExternalIdDebit: string;

    @Field(type => String)
    @IsUUID('all', { message: 'Invalid accountExternalIdCredit uuid' })
    readonly accountExternalIdCredit: string;

    @Field(type => Int)
    readonly tranferTypeId: number;

    @Field(type => Int)
    readonly value: number;
}