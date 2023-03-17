export class GetValidateTransaction{
    constructor(public readonly transactionExternalId:string){}

    toString(){
        return JSON.stringify({
            transactionExternalId:this.transactionExternalId
        })
    }
}