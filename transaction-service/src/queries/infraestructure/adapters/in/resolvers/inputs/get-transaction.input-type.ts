import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetTransactionInputType {
    @Field(type => String)
    transactionExternalId: string;
}