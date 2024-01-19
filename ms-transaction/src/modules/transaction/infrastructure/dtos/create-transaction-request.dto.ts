import { IsEnum, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { TransferType } from 'src/modules/transaction/domain/transaction-transfer-type';

export class CreateTransactionRequestDto {
  @IsUUID()
  id: string;

  @IsUUID()
  creditAccountExternalId: string;

  @IsUUID()
  debitAccountExternalId: string;

  @IsEnum(TransferType)
  transferType: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
