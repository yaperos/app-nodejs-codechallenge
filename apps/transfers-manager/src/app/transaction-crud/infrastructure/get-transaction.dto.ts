import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetTransactionDto {

    @IsNotEmpty()
    @IsUUID()
    transactionId: UUID;
}