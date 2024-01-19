import { IsInt, IsNumber, IsPositive, IsString } from "class-validator";

export class TransactionCreateDto {
    @IsString()
    readonly accountExternalIdDebit: string;
  
    @IsString()
    readonly accountExternalIdCredit: string;
  
    @IsInt()
    @IsPositive()
    readonly transferTypeId: number;
  
    @IsNumber()
    @IsPositive()
    readonly value: number;
}