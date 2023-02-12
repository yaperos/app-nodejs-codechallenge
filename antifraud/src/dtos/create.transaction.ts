import {IsNotEmpty, IsNumber, IsString, IsUUID} from "class-validator";
import {TransactionStatus} from "./status.enum";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsUUID()
    accountExternalIdDebit: string;

    @IsNotEmpty()
    @IsUUID()
    accountExternalIdCredit: string;

    @IsNotEmpty()
    @IsString()
    status: TransactionStatus;

    @IsNotEmpty()
    @IsNumber()
    transferTypeId: number;

    @IsNotEmpty()
    @IsNumber()
    value: number;
}