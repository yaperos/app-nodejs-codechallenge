import { ObjectType, Field } from '@nestjs/graphql'
import { ApiProperty } from "@nestjs/swagger";


@ObjectType('TransactionStatus')
export class TransactionStatus {
    @Field()
    id: number;

    @Field()
    @ApiProperty()
    name: string;
}