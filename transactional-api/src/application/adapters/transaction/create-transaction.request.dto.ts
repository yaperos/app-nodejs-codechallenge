import { IsUUID, IsInt, IsNumber, IsPositive, IsOptional } from "class-validator";

export class CreateTransactionRequestDto {
    @IsUUID()
    @IsOptional()
    readonly accountExternalIdDebit: string;
    @IsUUID()
    @IsOptional()
    readonly accountExternalIdCredit: string;
    @IsInt()
    readonly tranferTypeId: number;
    @IsNumber()
    @IsPositive()
    readonly value: number;
}