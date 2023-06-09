import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { FinancialTransactionTypeEnum } from '../../domain/transfer-type.enum';

export class CreateFinancialTransactionRequestDTO {
  @IsUUID()
  readonly accountExternalIdDebit: string;
  @IsUUID()
  readonly accountExternalIdCredit: string;
  @IsEnum(FinancialTransactionTypeEnum)
  readonly transferTypeId: string;
  @IsNumber()
  readonly value: number;
}
