import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateTransactionDto {
        @IsString()
        @IsNotEmpty()
        accountExternalIdDebit: string;

        @IsString()
        @IsNotEmpty()
        accountExternalIdCredit: string;

        @IsNotEmpty()
        @IsEnum([1, 2])
        @IsInt()
        transferTypeId: number;

        @IsInt()
        @IsNotEmpty()
        value: number;
}
