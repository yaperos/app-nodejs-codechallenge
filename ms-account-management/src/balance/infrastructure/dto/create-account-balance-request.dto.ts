import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateAccountBalanceRequestDto as ICreateAccountBalanceRequestDto } from 'src/balance/domain/dto/create-account-balance-request.dto';

export class CreateAccountBalanceRequestDto
  implements ICreateAccountBalanceRequestDto
{
  @IsNotEmpty()
  @IsUUID()
  public userId: string;
}
