export class IncomingTransaction {
    public accountExternalIdDebit:string;
    public accountExternalIdCredit:string;
    public tranferTypeId:number;
    public value:number;
}

export class CreatedTransaction {
    public id:number;
    public transaction_external_id:string;
    public account_external_id_debit:string;
    public account_external_id_credit:string;
    public transactionType:string;
    public transaction_status:string;
    public value:number;
    public created_At:string;
    public modified_At:string | null;
}
export class CreateTransaction {
    public transaction_external_id:string;
    public account_external_id_debit:string;
    public account_external_id_credit:string;
    public transactionType:string;
    public transaction_status:string;
    public value:number;
    public created_At:string;
    public modified_At:string | null;

}

export class RetrieveTransaction {
    public id:number;
    public transaction_external_id:string
    public transactionType:string;
    public transaction_status:string;
    public value:number;
    public created_At:string;
    public modified_At:string;
}

export class UpdateTransaction {
    public transaction_external_id:string
    public modified_At:string;
    public transaction_status:string;
}

export class EmitTransactionToValidation {
    public transaction_external_id:string;
    public value:number;
    public id:number;

}

