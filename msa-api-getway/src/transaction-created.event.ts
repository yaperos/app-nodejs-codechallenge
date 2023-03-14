export class TransactionCreatedEvent{
    constructor(
        public readonly transactionExternalId:string,
        public readonly accountExternalIdDebit:string,
        public readonly accountExternalIdCredit:string,
        public readonly tranferTypeId:number,
        public readonly value:number
    ){}

    toString(){
        return JSON.stringify({
            transactionExternalId:this.transactionExternalId,
            accountExternalIdDebit:this.accountExternalIdDebit,
            accountExternalIdCredit:this.accountExternalIdCredit,
            tranferTypeId:this.tranferTypeId,
            value:this.value})
    }

    
}