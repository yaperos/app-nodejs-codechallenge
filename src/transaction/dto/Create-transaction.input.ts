import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateTransactionInput { 
    @IsNotEmpty()
    @Field() 
    accountExternalIdDebit: string
    
    @IsNotEmpty()
    @Field()
    accountExternalIdCredit: string
    
    @IsNotEmpty()
    @Field()
    transacionTypeId: string

    @IsNotEmpty()
    @Field()
    value: number

}
