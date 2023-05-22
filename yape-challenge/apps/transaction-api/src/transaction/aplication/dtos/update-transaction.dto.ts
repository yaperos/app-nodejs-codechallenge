import { IsNotEmpty, IsString } from "class-validator";

export class UpdateTransactionDTO {
    @IsNotEmpty()
    // @IsUUID()
    transactionExternalId: string;

    @IsString()
    @IsNotEmpty()
    status: string;
  }