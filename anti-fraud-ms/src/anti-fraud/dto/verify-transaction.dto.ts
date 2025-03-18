import { IsNumber, IsString, IsUUID } from 'class-validator';

export class VerifyTransactionDto {
  @IsUUID()
  externalTransactionId: string;

  @IsString()
  status: string;

  @IsNumber()
  value: number;
}
