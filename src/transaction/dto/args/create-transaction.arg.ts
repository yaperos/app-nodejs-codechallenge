import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { IsString, IsOptional, IsNumber, IsNotEmpty } from "class-validator";
import { TranferType } from "src/transaction/enums/transfer-type.enum";

@ArgsType()
export class CreateTransactionArgs {

    @Field( () => String)
    @IsString()
    @IsOptional()
    accountExternalIdDebit: string;

    @Field( () => String)
    @IsString()
    @IsOptional()
    accountExternalIdCredit: string;

    @Field( () => TranferType)
    @IsNumber()
    tranferTypeId: TranferType;

    @Field( () => Int)
    @IsNumber()
    @IsNotEmpty()
    value: number;
}