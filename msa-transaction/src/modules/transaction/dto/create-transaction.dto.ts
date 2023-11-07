import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { TransactionStatus } from 'src/types/transaction.type';
import { TransactionStatus as TrxStatus } from 'src/constants/transaction.const';
export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn([1])
  tranferTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;

  @IsOptional()
  @IsIn(Object.values(TrxStatus))
  status?: TransactionStatus;

  @IsOptional()
  @IsUUID()
  id: string;
}
