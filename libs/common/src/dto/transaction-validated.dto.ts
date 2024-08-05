import { IsNumber, IsPositive, IsString } from 'class-validator';

export class TransactionValidatedRequest {
  @IsString()
  id: string;

  @IsNumber()
  @IsPositive()
  value: number;
}
