import { IsNumber, IsPositive, IsUUID } from "class-validator";

export class TransactionStatusUpdateDto {
    @IsUUID()
    transactionExternalId: string;

    @IsNumber()
    @IsPositive()
    statusId: number;
}