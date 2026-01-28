import {
    IsUUID,
    IsInt,
    IsNumber,
    Min,
    IsPositive,
    IsNotEmpty,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateTransactionDto {
    @IsUUID()
    @IsNotEmpty()
    accountExternalIdDebit: string;
  
    @IsUUID()
    @IsNotEmpty()
    accountExternalIdCredit: string;
  
    @IsInt()
    @Min(1)
    transferTypeId: number;
  
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    value: number;
  }