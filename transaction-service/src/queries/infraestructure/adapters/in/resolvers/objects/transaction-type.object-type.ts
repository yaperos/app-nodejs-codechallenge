import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionTypeObjectType {
    @Field(type => String)
    name: string;
}