import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateTransactionDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEnum([2, 3])
    @IsInt()
    transactionStatusId: number;
}
