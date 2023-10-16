import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateBalanceTransactionRequestDto as ICreateBalanceTransactionRequestDto } from 'src/balance/domain/dto/create-balance-transaction-request.dto';
import { TransactionType } from 'src/balance/domain/entity/balance-transaction';

export class CreateBalanceTransactionRequestDto
  implements ICreateBalanceTransactionRequestDto
{
  @IsNotEmpty()
  @IsUUID()
  public accountBalanceId: string;

  @IsNotEmpty()
  @IsUUID()
  public userId: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  public transactionType: TransactionType;

  @IsNotEmpty()
  @IsString()
  public description: string;

  @IsNotEmpty()
  @IsNumber()
  public amount: number;
}
