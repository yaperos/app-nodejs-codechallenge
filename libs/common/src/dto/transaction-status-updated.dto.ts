import { IsNumber, IsString } from 'class-validator';

export class TransactionStatusUpdatedRequest {
  @IsString()
  id: string;

  @IsNumber()
  transactionStatusId: number;

  @IsString()
  transactionStatusName: string;
}
