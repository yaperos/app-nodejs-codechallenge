import {Field, InputType, Int} from '@nestjs/graphql';
import {IsNotEmpty} from 'class-validator'

@InputType()//Indico que es una dato de entrada
export class CreateTransactionInput {
   
    @IsNotEmpty()
    @Field()
    accountExternalIdDebit: string;

    @IsNotEmpty()
    @Field()
    accountExternalIdCredit: string;

    @IsNotEmpty()
    @Field((type)=>Int)
    value:number;

    @IsNotEmpty()
    @Field(()=>Int)
    transactionStatusId: number;

    @IsNotEmpty()
    @Field(()=>Int)
    tranferTypeId: number
}