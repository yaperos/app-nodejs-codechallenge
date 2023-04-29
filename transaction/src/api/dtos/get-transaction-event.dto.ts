import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class GetTransactionEventDto {
    @IsNotEmpty()
    @IsUUID()
    transactionExternalId: string;
  
    @IsNumber()
    @IsNotEmpty()
    status: number;
  }
  