import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionStatusObjectType {
    @Field(type => String)
    name: string;
}