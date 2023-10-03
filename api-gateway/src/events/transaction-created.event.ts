export class TransactionCreated {
    constructor(
        public readonly accountExternalIdDebit:string,
        public readonly accountExternalIdCredit:string,
        public readonly tranferTypeId:number,
        public readonly value:number,
    ){}

    toString() {
        return JSON.stringify({
            accountExternalIdDebit: this.accountExternalIdDebit,
            accountExternalIdCredit: this.accountExternalIdCredit,
            tranferTypeId: this.tranferTypeId,
            value: this.value
        })
    }
}