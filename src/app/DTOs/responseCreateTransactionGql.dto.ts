import { ObjectType, Field } from "@nestjs/graphql";


@ObjectType()
export class ResponseCreateTransactionGlqDto{
  @Field()
  status: boolean;

  @Field()
  message: string;
}