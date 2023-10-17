import { CreateTransactionRequestDto } from '../dto/create-transaction-request.dto';
import { GenericResponseDto } from '../dto/generic-response.dto';

export interface CreateTransaction {
  execute(dto: CreateTransactionRequestDto): Promise<GenericResponseDto>;
}
