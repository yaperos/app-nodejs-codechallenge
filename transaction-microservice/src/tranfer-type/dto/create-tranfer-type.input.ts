import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTranferTypeInput {

  @Field()
  name: string; // que pasen solo el nombre al momento de crear, el id es automatico
}
