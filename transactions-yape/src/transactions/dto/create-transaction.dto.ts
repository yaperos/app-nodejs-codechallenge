import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTransactionDto {

    @IsString()
    eventType: string

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
