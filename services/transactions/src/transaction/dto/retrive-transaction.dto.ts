import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class RetriveTransactionDto {
    @IsInt()
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEnum([2, 3])
    @IsInt()
    transactionStatus: number;
}
