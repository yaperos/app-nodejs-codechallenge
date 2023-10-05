import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTransactionDto {

    @IsNotEmpty()
    @IsUUID() 
    accountExternalIdDebit:string;

    @IsNotEmpty()
    @IsUUID() 
    accountExternalIdCredit:string;

    @IsNotEmpty()
    @IsNumber() 
    tranferTypeId:number;

    @IsNotEmpty()
    @IsNumber() 
    value:number;

}
