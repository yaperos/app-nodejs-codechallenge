import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Max, Min } from "class-validator";

export class TransactionRequest {

    @IsNotEmpty()
    @IsUUID()
    accountExternalIdDebit: string;

    @IsNotEmpty()
    @IsUUID()
    accountExternalIdCredit: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message: "Type Transaction must be 1" })
    @Max(1, { message: "Type Transaction must be 1" })
    tranferTypeId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0.1)
    @IsPositive()
    value: number;
}