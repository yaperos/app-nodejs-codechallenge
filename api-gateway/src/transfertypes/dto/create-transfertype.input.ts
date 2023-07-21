import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransfertypeInput {
  
  @Field()
  name: string;
 
}
