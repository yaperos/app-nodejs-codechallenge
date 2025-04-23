import { IsString, IsUUID } from 'class-validator';

export class TransactionDetailRequestDto {
  @IsString()
  @IsUUID(4)
  externalId: string;
}
