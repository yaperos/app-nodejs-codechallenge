import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class TransactionRepositoryImpl{

    @Field((type)=>ID)
    id: number

    @Field()
    accountExternalId: number

    @Field()
    typeAccount: number
    
    @Field()
    transferTypeId: number
    
    @Field(() => Int, {nullable:true})
    value?: number

    @Field()
    status: string

    @Field(() => Date, {nullable:true})
    createdAt: Date


}