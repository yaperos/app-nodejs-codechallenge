import { CreateBalanceTransactionRequestDto } from '../dto/create-balance-transaction-request.dto';
import { GenericResponseDto } from '../dto/generic-response.dto';

export interface CreateBalanceTransaction {
  execute(dto: CreateBalanceTransactionRequestDto): Promise<GenericResponseDto>;
}
