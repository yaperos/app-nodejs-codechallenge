import { IsEmail, IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateTransactionDto {

    @IsString()
    id: string;

    @IsString()
    accountExternalIdDebit: string;

    @IsString()
    accountExternalIdCredit: string;

    @IsNumber()
    tranferTypeId: number;

    @IsNumber()
    value: number;

    @IsString()
    status: string;

}
