import { IsNumberString, IsString, IsUUID } from 'class-validator';

export class TransactionFindParamsDto {
  @IsUUID('4')
  @IsString()
  transactionExternalId: string;
}
