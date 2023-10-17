import { CreateTranferTypeInput } from './create-tranfer-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTranferTypeInput extends PartialType(CreateTranferTypeInput) {
  @Field(() => Int)
  id: number;
}
