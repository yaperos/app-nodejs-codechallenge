import { CreateAccountBalanceRequestDto } from '../dto/create-account-balance-request.dto';
import { GenericResponseDto } from '../dto/generic-response.dto';

export interface CreateAccountBalance {
  execute(dto: CreateAccountBalanceRequestDto): Promise<GenericResponseDto>;
}
