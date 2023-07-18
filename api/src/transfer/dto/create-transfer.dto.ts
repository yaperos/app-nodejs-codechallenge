import { IsNotEmpty, IsInt, IsString, MaxLength, Min, Max } from 'class-validator';

export class CreateTransferDto {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    accountExternalIdDebit: string;
  
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    accountExternalIdCredit: string;

    @IsInt()
    @Min(1)
    @Max(10)
    tranferTypeId: number;


    @IsInt()
    @Min(1)
    @Max(1000)
    value: number;

    status:number;
  
}
