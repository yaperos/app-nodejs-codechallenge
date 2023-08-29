export class CreateTransactionDto {
    id: string;  
    accountExternalIdDebit: string;   
    accountExternalIdCredit: string;
    tranferTypeId:number;
    value: number;    
}
