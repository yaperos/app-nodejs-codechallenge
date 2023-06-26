import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { TransferType } from '../constants/enums';
import { TransactionInput } from '../graphql/types';

export class TransactionInputDto extends TransactionInput {
  @IsString()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsString()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsEnum(TransferType)
  transferTypeId: number;

  @IsNumber()
  value: number;
}
