import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TransactionStatus } from 'src/common/transaction.enum';

export class TransactionUpdateDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  transactionExternalId: string;

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status: TransactionStatus;
}
