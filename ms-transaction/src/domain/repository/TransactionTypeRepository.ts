import db from '../config/DatabaseConfig'
import { TransactionType } from '../models/db/TransactionType';

export default class TransactionTypeRepository {
    dataBase = new db();

    getTransactionbyName = async (transactionType: TransactionType) => {

        try {
            console.log('repo in service')
            const findedTransactionType = await TransactionType.findOne({ where: { name: transactionType.name } });
            if (findedTransactionType != null) {
                return findedTransactionType;
            } else {
                throw ('not found')
            }
        } catch (err) {
            console.log(err)
            throw (err)
        }
    }

}