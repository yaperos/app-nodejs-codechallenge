import {AutoMap} from '@automapper/classes';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class TransactionCreateDTO {
  @AutoMap()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  readonly accountExternalIdDebit: string;

  @AutoMap()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  readonly accountExternalIdCredit: string;

  @AutoMap()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly tranferTypeId: number;

  @AutoMap()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly value: number;
}
