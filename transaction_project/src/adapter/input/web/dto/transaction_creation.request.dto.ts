import { IsIn, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { TransactionTypeEnum } from 'src/domain/models/transaction_type_enum';

export class TransactionCreationRequestDto {
  @IsPositive()
  @IsNumber()
  value: number;

  @IsUUID()
  @IsString()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsString()
  accountExternalIdCredit: string;

  // Custom validator for this enum
  @IsIn(
    Object.values(TransactionTypeEnum)
      .filter((item) => {
        return isNaN(Number(item));
      })
      .map((key) => TransactionTypeEnum[key]),
  )
  transferTypeId: number;
}
