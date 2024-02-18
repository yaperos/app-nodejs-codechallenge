export default class Transaction {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;

    constructor(
        accountExternalIdDebit: string,
        accountExternalIdCredit: string,
        tranferTypeId: number,
        value: number
    ) {
        this.accountExternalIdDebit = accountExternalIdDebit
        this.accountExternalIdCredit = accountExternalIdCredit
        this.tranferTypeId = tranferTypeId
        this.value = value
    }
    
}