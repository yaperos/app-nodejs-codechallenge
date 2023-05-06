import { IsIn, IsInt, IsNumber, IsPositive, IsUUID } from "class-validator";
import { TransactionStatus } from "src/shared/constants";

export class CreateTransactionRequestDto {
    @IsUUID()
    readonly accountExternalIdDebit: string;

    @IsUUID()
    readonly accountExternalIdCredit: string;

    @IsInt()
    @IsIn(Object.values(TransactionStatus))
    readonly transferTypeId: number;

    @IsNumber()
    @IsPositive()
    readonly value: number;
} 