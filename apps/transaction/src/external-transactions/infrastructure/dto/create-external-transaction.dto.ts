import { Expose, Transform } from 'class-transformer';
import { IsUUID, IsNumber, IsIn } from 'class-validator';

const TranferTypes = {
  1: 'National Electronic Fund Transfer',
  2: 'Immediate Payment Service',
};

export class CreateExternalTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsIn(Object.values(TranferTypes), {
    message: `tranferTypeId must be one of the following values: ${Object.keys(
      TranferTypes,
    )}`,
  })
  @Expose({ name: 'tranferTypeId' })
  @Transform(({ value }) => TranferTypes[value])
  transactionType: string;

  @IsNumber()
  value: number;
}
