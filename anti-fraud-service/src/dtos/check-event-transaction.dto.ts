import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CheckEventTransactionDto {
    @IsNotEmpty()
    @IsUUID()
    readonly transactionExternalId: string;

    @IsNumber()
    @IsNotEmpty()
    readonly value: number;
  }