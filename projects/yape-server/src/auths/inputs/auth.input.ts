import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthInput {
  @Field()
  readonly username: string;

  @Field()
  readonly password: string;
}
