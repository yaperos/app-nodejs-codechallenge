import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
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
  @Min(0.1)
  @Max(10000)
  public amount: number;
}
