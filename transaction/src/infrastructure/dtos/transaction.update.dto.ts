import { IsNotEmpty, IsString } from "class-validator";

export class TransactionUpdateDto{
    @IsString()
    @IsNotEmpty()
    transactionExternalId: string;
    
    @IsString()
    @IsNotEmpty()
    status: number;
}