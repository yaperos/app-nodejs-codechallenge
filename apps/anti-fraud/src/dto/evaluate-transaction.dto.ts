import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class EvaluateTransactionDto {

    @IsUUID()
    @IsNotEmpty()
    transactionId: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}