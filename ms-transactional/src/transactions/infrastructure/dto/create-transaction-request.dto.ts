import { IsEnum, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';
import { CreateTransactionRequestDto as ICreateTransactionRequestDto } from 'src/transactions/domain/dto/create-transaction-request.dto';
import {
  Channel,
  TransferType,
} from 'src/transactions/domain/entity/transaction';

export class CreateTransactionRequestDto
  implements ICreateTransactionRequestDto
{
  @IsNotEmpty()
  @IsUUID()
  public accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsUUID()
  public accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsEnum(Channel)
  public channel: Channel;

  @IsNotEmpty()
  @IsEnum(TransferType)
  public transferType: TransferType;

  @IsNotEmpty()
  @Min(0.1)
  @Max(1000)
  public value: number;
}
