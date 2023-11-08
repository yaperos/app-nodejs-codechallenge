import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { TransactionStatus } from 'src/types/transaction.type';

export class CreateAntiFraudDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}

export interface AntiFraudUpdate {
  id: string;
  status: TransactionStatus;
}
