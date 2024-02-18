import db from '../config/DatabaseConfig'
import { TransactionStatus } from '../models/db/TransactionStatus';

export default class TransactionStatusRepository {
    dataBase = new db();

    getTransactionbyName = async (transactionStatus: TransactionStatus) => {

        try {
            console.log('repo in service')
            const findedTransactionStatus = await TransactionStatus.findOne({ where: { name: transactionStatus.name } });
            if (findedTransactionStatus != null) {

                return findedTransactionStatus;
            } else {
                throw ('not finded')
            }
        } catch (err) {
            throw (err)
        }
    }

}