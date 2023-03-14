import { IsUUID } from 'class-validator'
export class CreateTransactionRequest{
    @IsUUID('4')
    accountExternalIdDebit:string;
    
    @IsUUID('4')
    accountExternalIdCredit:string;

    tranferTypeId:number;
    value:number
}