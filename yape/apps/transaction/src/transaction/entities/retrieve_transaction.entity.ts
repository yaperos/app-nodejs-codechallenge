import {Int, Field, Float, ObjectType, ID} from '@nestjs/graphql';


@ObjectType()
class Type {

    @Field(()  => String)
    name: string
}

@ObjectType()
class Status {

    @Field(()  => String)
    name: string
}

@ObjectType()
export class RetrieveTransaction {

    @Field((type) => ID)
    transactionExternalId: string

    @Field(()  => Type, {nullable: true})
    transactionType: Type

    @Field(()  => Status)
    transactionStatus: Status

    @Field(()  => Float)
    value: number

    @Field(()  => Date)
    createdAt: Date
}