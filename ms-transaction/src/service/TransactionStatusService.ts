import { TransactionStatus } from '../domain/models/db/TransactionStatus'
import TransactionStatusRepository from '../domain/repository/TransactionStatusRepository'

export default class TransactionStatusService {
    transactionStatusRepository : TransactionStatusRepository;

    constructor(){
        this.transactionStatusRepository= new TransactionStatusRepository();
    }

    findTransaction = async(transactionStatus:TransactionStatus)=>{
        const transaction =  await this.transactionStatusRepository.getTransactionbyName(transactionStatus); 
        return transaction;  
    }
}