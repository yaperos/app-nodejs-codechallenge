import { TransactionStatusEnum } from "@yape-transactions/shared";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class TransactionStatusDto {
    @IsNotEmpty()
    @IsUUID()
    transactionId: UUID;

}