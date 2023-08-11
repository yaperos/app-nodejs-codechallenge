import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TransactionDto {

    // @IsNotEmpty()
    // @IsString()
    // id: string;

    @IsNotEmpty()
    @IsString()
    accountExternalIdDebit: string;
    
    @IsNotEmpty()
    @IsString()
    accountExternalIdCredit: string;

    @IsNotEmpty()
    transferTypeId: number;

    @IsNotEmpty()
    value: number;

    // @IsNotEmpty()
    // @IsString()
    // transactionStatus: string;

    // @IsDate()
    // // @IsNotEmpty()
    // createdAt: Date;
}

export class TransactionUpdateDto {

    @IsOptional()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    accountExternalIdDebit: string;
    
    @IsOptional()
    @IsString()
    accountExternalIdCredit: string;

    @IsOptional()
    transferTypeId: number;

    @IsOptional()
    value: number;

    @IsOptional()
    @IsString()
    transactionStatus: string;

    @IsDate()
    @IsOptional()
    createdAt: Date;
}