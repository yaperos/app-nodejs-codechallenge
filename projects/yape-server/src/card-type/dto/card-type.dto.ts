import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class CardTypeDto {
  @Field()
  readonly id: string;

  @Field()
  readonly name: string;

  @Field()
  readonly resource: string;

  @Field()
  readonly description: string;

  @Field()
  readonly isActive: string;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: string;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: string;
}
