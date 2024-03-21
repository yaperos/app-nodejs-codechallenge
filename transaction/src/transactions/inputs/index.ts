import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { IsUUID, IsNotEmpty, IsNumber } from "class-validator";

@InputType()
export class CreateTransactionInput {
    @IsUUID()
    @IsNotEmpty()
    @Field()
    accountExternalIdDebit: string;
    
    @IsUUID()
    @IsNotEmpty()
    @Field()
    accountExternalIdCredit: string;
    
    @IsNumber()
    @Field(()=> Float)
    value: number;

    @IsNumber({
        maxDecimalPlaces:0
    })
    @Field(()=> Int)
    transactionTypeId: number;
}


@InputType()
export class GetTransactionInput {
    @IsUUID()
    @IsNotEmpty()
    @Field()
    id: string;
}