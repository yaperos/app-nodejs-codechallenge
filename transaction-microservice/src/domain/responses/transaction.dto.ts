import { Exclude, Expose } from 'class-transformer';
import { BasicNameDto } from './basic-name.dto';

@Exclude()
export class TransactionDto {
  @Expose()
  readonly transactionExternalId: string;

  @Expose()
  readonly transactionType: BasicNameDto;

  @Expose()
  readonly transactionStatus: BasicNameDto;

  @Expose()
  readonly value: number;

  @Expose()
  readonly createdAt: Date;
}
