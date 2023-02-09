import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewTransactionMessage {
  @IsNotEmpty()
  @IsString()
  transactionExternalId: string;

  @IsNumber()
  transactionValue: number;
}
