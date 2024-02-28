import { Field, ID, InputType, PartialType } from "@nestjs/graphql";
import { IsJSON, IsString, IsUUID } from "class-validator";
import { CreateBankingTransactionInput } from "./create-banking-transaction";

@InputType()
export class UpdateBankingTransactionInput {
    
    @Field(() => ID)
    @IsUUID()
    transactionExternalId: string

    @Field(() => String)
    @IsString()
    transactionStatus: string; 
}