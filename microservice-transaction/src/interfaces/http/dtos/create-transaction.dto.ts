import {
    IsUUID,
    IsInt,
    IsNumber,
    IsPositive,
    IsString,
    IsIn,
  } from 'class-validator';
  export class CreateTransactionDto {
    @IsString()
    @IsUUID()
    readonly accountExternalIdDebit: string;
  
    @IsString()
    @IsUUID()
    readonly accountExternalIdCredit: string;
  
    @IsInt()
    @IsPositive()
    @IsIn([1, 2, 3])
    readonly tranferTypeId: number;
  
    @IsNumber()
    @IsPositive()
    readonly value: number;
  }
  