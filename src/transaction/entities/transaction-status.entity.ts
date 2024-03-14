import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TransactionStatus {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

}
