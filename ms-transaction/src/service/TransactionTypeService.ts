import { TransactionType } from '../domain/models/db/TransactionType'
import TransactionTypeRepository from '../domain/repository/TransactionTypeRepository'

export default class TransactionTypeService {
    transactionTypeRepository : TransactionTypeRepository;

    constructor(){
        this.transactionTypeRepository= new TransactionTypeRepository();
    }

    findTransaction = async(transactionType:TransactionType)=>{
        try{            
            const transaction =  await this.transactionTypeRepository.getTransactionbyName(transactionType); 
            return transaction;  
        }catch(err){
            throw(err);
        }
    }
}