import { CreateTransfertypeInput } from './create-transfertype.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransfertypeInput extends PartialType(CreateTransfertypeInput) {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
