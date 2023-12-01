import { IsNotEmpty, IsUUID, IsNumber, IsEnum } from 'class-validator';
import { TransactionTransferType } from '../../domain/enums/transaction-transfer-type.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(TransactionTransferType)
  tranferTypeId: TransactionTransferType;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
