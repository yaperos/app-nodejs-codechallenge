import { IsMongoId } from 'class-validator';

export class ResquestGetTransactionDto {
  @IsMongoId()
  'transactionExternalId': string;
}
