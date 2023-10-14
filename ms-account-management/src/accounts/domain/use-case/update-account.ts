import { GenericResponseDto } from '../dto/generic-response.dto';
import { UpdateAccountRequestDto } from '../dto/update-account-request.dto';

export interface UpdateAccount {
  execute(dto: UpdateAccountRequestDto): Promise<GenericResponseDto>;
}
