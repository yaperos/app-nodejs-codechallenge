import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateTransactionOutputDto {
  @Field()
  id: string;

  @Field(() => Float)
  amount: number;

  @Field()
  createdAt: Date;
}
