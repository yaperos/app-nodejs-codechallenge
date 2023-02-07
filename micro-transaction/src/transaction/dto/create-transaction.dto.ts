import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

@Expose()
export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  @Expose({ name: 'accountExternalIdDebit' })
  account_external_id_debit: string;

  @IsUUID()
  @IsNotEmpty()
  @Expose({ name: 'accountExternalIdCredit' })
  account_external_id_credit: string;

  // @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Expose({ name: 'tranferTypeId' })
  transfer_type_id: number;

  @IsNumber()
  value: number;
}
