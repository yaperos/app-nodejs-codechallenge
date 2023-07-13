import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  @ApiProperty()
  accountExternalIdDebit: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50)
  @ApiProperty()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  value: number;
}
