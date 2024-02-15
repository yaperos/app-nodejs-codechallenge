import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsUUID, isInt } from 'class-validator';

export class transactionRequest {
    @IsNotEmpty()
    @IsUUID()
    @IsOptional()
    accountExternalIdDebit: string;

    @IsNotEmpty()
    @IsUUID()
    @IsOptional()
    accountExternalIdCredit: string;

    @IsNotEmpty()
    @IsInt()
    tranferTypeId: number;

    @IsNotEmpty()
    @IsPositive()
    value: number;

}