import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { Gender } from 'src/common/constants';

@ObjectType()
export class UserDTO {
  @Field()
  readonly id: string;

  @Field()
  readonly name: string;

  @Field()
  readonly email: string;

  @Field()
  readonly username: string;

  @Field()
  readonly gender: Gender;

  @Field()
  readonly birthday: string;

  @Field()
  readonly stripeCostumerId: string;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: string;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: string;
}
