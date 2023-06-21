import DateUtil from "../libs/date";
import TransactionEntity from "./transaction.entity";
import UuidUtil from "../libs/uuid";


export class TransactionValue implements TransactionEntity{
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    status?: number;
    createdAt: string;
    createdAtTimestamp: number;
    updatedAt: string;
    updatedAtTimestamp: number;

    constructor({accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value, status}: TransactionEntity){
        const now = DateUtil.getCurrentDate()

        this.transactionExternalId = UuidUtil.getId();
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.createdAt = now.dateTime
        this.createdAtTimestamp = now.timestamp
        this.tranferTypeId = tranferTypeId
        this.value = value
        this.status = status
    }
}