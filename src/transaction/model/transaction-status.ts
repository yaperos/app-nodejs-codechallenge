import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionStatus {
  @Field((type)=> String , {nullable: true ,description: 'name transaction type'})
  name: string;
}