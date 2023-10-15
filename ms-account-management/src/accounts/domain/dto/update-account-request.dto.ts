import { AccountStatus } from '../entity/account';
import { CreateAccountRequestDto } from './create-account-request.dto';

export interface UpdateAccountRequestDto
  extends Partial<CreateAccountRequestDto> {
  status?: AccountStatus;
}
