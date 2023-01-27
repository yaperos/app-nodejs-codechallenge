import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetTransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;
}