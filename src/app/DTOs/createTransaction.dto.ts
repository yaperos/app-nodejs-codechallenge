

import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(36)
  @MaxLength(36)
  @ApiProperty()
  accountExternalIdCredit: string;
  
  @IsString()
  @IsNotEmpty()
  @MinLength(36)
  @MaxLength(36)
  @ApiProperty()
  accountExternalIdDebit: string;
  
  @IsNumber()
  @IsNotEmpty()
  @Max(1)
  @Min(1)
  @ApiProperty()
  transferTypeId: number;
  
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  value: number;

}