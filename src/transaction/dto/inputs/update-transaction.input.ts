import { Field, InputType, Int } from "@nestjs/graphql";
import { IsString, IsNumber } from "class-validator";

@InputType()
export class UpdateTransactionInput {

    @Field( () => String)
    @IsNumber()
    id: string;

    @Field( () => String)
    @IsString()
    transactionStatus: string;
}