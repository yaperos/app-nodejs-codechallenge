import { IsNotEmpty, IsUUID } from "class-validator";

export class GetTransactionRequestDto{
    @IsUUID()
    @IsNotEmpty()
    transactionExternalId: string;
}