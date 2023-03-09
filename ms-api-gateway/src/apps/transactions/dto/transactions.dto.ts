import { IsString, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateTransactionDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    accountExternalIdDebit: string;

    @IsString()
    @IsUUID()
    @IsNotEmpty()
    accountExternalIdCredit: string;

    @IsNumber()
    @IsNotEmpty()
    tranferTypeId: number;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}

export class GetOneTransactionParam {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    id: string;
}