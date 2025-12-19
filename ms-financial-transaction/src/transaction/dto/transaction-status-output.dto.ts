import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionStatusOutputDto {
  @Field()
  name: string;
}
