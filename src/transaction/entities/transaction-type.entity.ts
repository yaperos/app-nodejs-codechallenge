import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TransactionType {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

}
