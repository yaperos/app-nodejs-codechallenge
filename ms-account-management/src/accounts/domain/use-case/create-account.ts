import { CreateAccountRequestDto } from '../dto/create-account-request.dto';
import { GenericResponseDto } from '../dto/generic-response.dto';

export interface CreateAccount {
  execute(dto: CreateAccountRequestDto): Promise<GenericResponseDto>;
}
