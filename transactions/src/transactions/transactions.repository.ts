import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import TransactionsEntity from "./transactions.entity";
import { CreateTransaction, UpdateTransaction } from "./dto/transactions.dto";


@Injectable()
export default class TransactionRepository {
    private logger: Logger;
    constructor(
        @InjectRepository(TransactionsEntity)
        private transactionsRepository : Repository<TransactionsEntity>){
        this.logger = new Logger(TransactionRepository.name);
    }

    public async getOne(id:number): Promise<TransactionsEntity>{
        return await this.transactionsRepository.findOneBy({id:id});
    }

    public async getAll():Promise<TransactionsEntity[]>{
        return await this.transactionsRepository.find();
    }

    public async create(createTransaction: CreateTransaction):Promise<TransactionsEntity>{
        return this.transactionsRepository.save(createTransaction);        
    }
    
    public async update(updateTransaction: UpdateTransaction):Promise<UpdateResult>{
        return await this.transactionsRepository.update(
            {transaction_external_id:updateTransaction.transaction_external_id}, updateTransaction);
    }
}