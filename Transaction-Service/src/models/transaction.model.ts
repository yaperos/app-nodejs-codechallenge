import { TransactionAttributes } from '../../interfaces/transaction.interface';

export class Transaction<TransactionAttributes> {

    constructor(
        id: string,
        transactionExternalId: string,
        accountExternalIdDebit: string,
        accountExternalIdCredit: string,
        tranferTypeId: number,
        tranferStatusId: number,
        value: number
     ){

    }
}