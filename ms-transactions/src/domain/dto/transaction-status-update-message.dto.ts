import { IsString, IsNotEmpty } from 'class-validator';

export class TransactionStatusUpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
