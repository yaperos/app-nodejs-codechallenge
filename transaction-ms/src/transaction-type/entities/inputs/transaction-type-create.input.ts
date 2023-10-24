import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TransactionTypeCreateInput {

    @Field(() => String, {nullable:false})
    name!: string;
}
