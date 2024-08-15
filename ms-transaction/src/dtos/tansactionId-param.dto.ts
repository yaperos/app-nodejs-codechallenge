// src/transaction/dto/transaction-id-param.dto.ts
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class TransactionIdParamDto {
  @IsNotEmpty()
  transactionExternalId: string;
}