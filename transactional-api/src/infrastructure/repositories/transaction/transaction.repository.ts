import { Injectable } from "@nestjs/common";
import { Transaction } from "src/domain/entities/transaction.entity";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { ITransactionRepository } from "src/domain/interfaces/itransaction.repository";

@Injectable()
export class TransactionRepository implements ITransactionRepository{

    constructor(
        @InjectRepository(Transaction) 
        private TransactionCtx: Repository<Transaction>
    ){}

    async create(item: Transaction): Promise<Transaction>{
        console.log('Peticion');
        console.log(item);
        var res = await this.TransactionCtx.save(item);
        console.log('Respuesta');
        console.log(res);
        return res;

        
    }

}