import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class TransactionDto {

    @IsString()
    accountExternalIdDebit: string;

    @IsString()
    accountExternalIdCredit: string;

    @IsNumber()
    tranferTypeId: number;

    @IsNumber()
    value: number;
}