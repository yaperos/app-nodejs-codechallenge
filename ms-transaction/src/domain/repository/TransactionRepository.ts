import  Transaction  from '../models/db/TransactionModel';
import db from '../config/DatabaseConfig'

export default class TransactionRepository {
    dataBase = new db();
    createTransaction = async (transaction: Transaction) => {
        try{
        await this.dataBase.testConnection();
        await this.dataBase.initialize();
        }catch(err){
            console.log('dbsync')
            console.log(err);
        }
        try {
            console.log('repo in service')
            const transactionSaved = await transaction.save();
            return transactionSaved;
        } catch (err) {
            console.log(err);
        } 
    }
}