import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

@InputType()
export class TransactionGetOneDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    transactionId: string;
}
