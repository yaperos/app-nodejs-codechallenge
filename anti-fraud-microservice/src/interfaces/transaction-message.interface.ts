export interface ITransactionMessage {    
    id: number;  
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    value:number;
    transactionStatusId: number;
    tranferTypeId: number
}
