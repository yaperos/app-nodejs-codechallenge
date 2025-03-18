import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class FindOneTransactionMTDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ValidateIf((o) => !o.name)
  id?: number;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.id)
  name?: string;
}

export class FindOneTransactionDto {
  @IsUUID()
  transactionExternalId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => FindOneTransactionMTDto)
  transactionType: FindOneTransactionMTDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FindOneTransactionMTDto)
  transactionStatus: FindOneTransactionMTDto;

  @IsNumber()
  value: number;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
