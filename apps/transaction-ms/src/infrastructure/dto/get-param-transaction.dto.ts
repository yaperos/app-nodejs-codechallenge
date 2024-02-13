import { IsMongoId } from 'class-validator';

export class GetParamTransactionDto {
  @IsMongoId()
  id: string;
}
