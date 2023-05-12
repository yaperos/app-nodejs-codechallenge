import { IsUUID, IsNotEmpty } from "class-validator";

export class GetTransactionRequestDto {
    @IsUUID()
    @IsNotEmpty()
    readonly transactionExternalId: string;
}