import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateTransactionDto{
    @IsNotEmpty()
    @IsUUID()
    accountExternalIdDebit: string;
    @IsNotEmpty()
    @IsUUID()
    accountExternalIdCredit: string;
    @IsNotEmpty()
    @IsNumber()
    transferTypeId: number;
    @IsNotEmpty()
    @IsNumber()
    value: number;
}

export class UpdateTransactionDto{
    @IsNotEmpty()
    @IsUUID()
    externalId: string;
    @IsNotEmpty()
    @IsString()
    status: string;

}