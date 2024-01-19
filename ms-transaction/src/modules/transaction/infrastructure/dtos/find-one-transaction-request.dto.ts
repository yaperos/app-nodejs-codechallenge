import { IsUUID } from 'class-validator';

export class FindOneTransactionRequestDto {
  @IsUUID()
  id: string;
}
