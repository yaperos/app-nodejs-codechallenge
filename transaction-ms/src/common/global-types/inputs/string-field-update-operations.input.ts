import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class StringFieldUpdateOperationsInput {

    @Field(() => String, {nullable:true})
    set?: string;
}

@InputType()
export class StringUUIDFieldUpdateOperationsInput {

    @Field(() => GraphQLUUID, {nullable:true})
    set?: string;
}
