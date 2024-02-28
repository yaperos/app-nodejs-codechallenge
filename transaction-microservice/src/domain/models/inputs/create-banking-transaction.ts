import { Field, Float, ID, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNumber, IsOptional, IsUUID } from "class-validator";

@InputType()
export class CreateBankingTransactionInput {
    
    @Field(() => ID)
    @IsUUID()
    accountExternalIdDebit: string;
    
    @Field(() => ID)
    @IsUUID()
    accountExternalIdCredit: string;
    
    @Field(() => Int)
    @IsInt()
    transferTypeId: number;

    @Field(() => Float)
    @IsNumber()
    value: number;
}