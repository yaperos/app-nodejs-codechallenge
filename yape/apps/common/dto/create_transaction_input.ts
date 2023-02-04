import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {IsUUID, IsNumber, IsInt, IsNotEmpty} from 'class-validator'
@InputType()
export class CreateTransactionInput {


    @Field(()  => String)
    @IsNotEmpty()
    @IsUUID(4)
    accountExternalIdDebit: string

    @Field(()  => String)
    @IsNotEmpty()
    @IsUUID(4)
    accountExternalIdCredit: string

    @Field(()  => Int)
    @IsNotEmpty()
    @IsInt()
    transferTypeId: number

    @Field(()  => Float )
    @IsNumber()
    @IsNotEmpty()
    value: number

}