import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field()
  readonly email: string;

  @Field()
  password: string;

  @Field()
  readonly username: string;
}
