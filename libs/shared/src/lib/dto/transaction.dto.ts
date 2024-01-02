import { IsInt, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class TransactionDto {

    transactionId?: UUID;

    @IsNotEmpty()
    @IsUUID()
    accountExternalIdDebit: UUID;

    @IsNotEmpty()
    @IsUUID()
    accountExternalIdCredit: UUID;

    @IsNotEmpty()
    @IsInt()
    tranferTypeId: number;

    @IsNotEmpty()
    @IsNumber()
    value: number;
}