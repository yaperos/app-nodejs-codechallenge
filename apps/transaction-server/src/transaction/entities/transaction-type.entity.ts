import { ObjectType, Field, ID } from '@nestjs/graphql'
import { ApiProperty } from "@nestjs/swagger";

@ObjectType('TransactionType')
export class TransactionType {
    @Field()
    id: number;

    @Field()
    @ApiProperty()
    name: string;
}