import { TransactionStatusModel } from "./transaction-status.model";
import { TransactionTypeModel } from "./transaction-type.model";

export class TransactionModel{
    id! :number;
    externalId!: string;
    accountExternalIdDebit!: string;
    accountExternalIdCredit!: string;
    typeId!: number;
    type!: TransactionTypeModel;
    value!: number;
    statusId!: number;
    status!: TransactionStatusModel;
    createdAt!: Date;
    updatedAt: Date;
}