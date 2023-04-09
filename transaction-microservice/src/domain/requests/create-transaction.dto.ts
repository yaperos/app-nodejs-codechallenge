import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { AccountTypeEnum } from '../enums/account-type.enum';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  readonly externalId: string;

  @IsEnum(() => AccountTypeEnum)
  readonly accountType: AccountTypeEnum;

  @IsNumber()
  @Min(1)
  readonly transferTypeId: number;

  @IsDecimal()
  @Min(1)
  readonly value: number;
}
