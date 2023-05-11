import { IsUUID, IsInt, IsNumber, IsPositive } from "class-validator";

export class CreateTransactionRequestDto {
    @IsUUID()
    readonly accountExternalIdDebit: string;
    @IsUUID()
    readonly accountExternalIdCredit: string;
    @IsInt()
    readonly tranferTypeId: number;
    @IsNumber()
    @IsPositive()
    readonly value: number;
}