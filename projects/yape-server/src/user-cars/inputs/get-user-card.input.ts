import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetUserCardInput {
  @Field()
  readonly stripePaymentMethodId: string;
}
