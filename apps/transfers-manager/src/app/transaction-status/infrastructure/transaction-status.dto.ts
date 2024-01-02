import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class TransactionStatusDto {
    @IsNotEmpty()
    @IsUUID()
    transactionId: UUID;

}