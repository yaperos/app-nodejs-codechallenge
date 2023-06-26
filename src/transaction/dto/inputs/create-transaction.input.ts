import { Field, InputType, Int } from "@nestjs/graphql";
import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator";
import { IsNotEmptyIfAnyPropertyIsEmpty } from "./../../decorators/is-not-empty-account.decorator"

@InputType()
export class CreateTransactionInput {

    @Field( () => String)
    @IsString()
    @IsOptional()
    @IsNotEmptyIfAnyPropertyIsEmpty()
    accountExternalIdDebit: string;

    @Field( () => String)
    @IsString()
    @IsOptional()
    @IsNotEmptyIfAnyPropertyIsEmpty()
    accountExternalIdCredit: string;

    @Field( () => Int)
    @IsNumber()
    tranferTypeId: number;

    @Field( () => Int)
    @IsNumber()
    @IsNotEmpty()
    value: number;
}