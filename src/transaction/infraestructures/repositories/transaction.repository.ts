import { Inject, Injectable } from "@nestjs/common";
import { ITransactionModel, TransactionModel, TransactionProperties } from "src/transaction/domains/model/transaction.model";
import { ITransactionRepository } from "src/transaction/domains/repositories/transaction.repository";
import { TransactionEntity } from "../entities/transaction.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionFactory } from "src/transaction/domains/factory/transaction.factory";
import { writeConnection } from "libs/DatabaseModule";

@Injectable()
export class TransactionRepository implements ITransactionRepository
{
    //constructor( @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>) {}
   
    @Inject() 
    private readonly transactionFactory: TransactionFactory;

    updateStatusTransaction(model: TransactionModel): Promise<TransactionEntity> {
        throw new Error("Method not implemented.");
    }
    
    async createTransaction(model: ITransactionModel): Promise<TransactionEntity> {
        const p = (JSON.parse(JSON.stringify(model)) as TransactionProperties);
        const entities = this.modelToEntity(model);
        return await writeConnection.manager.getRepository(TransactionEntity).save(entities);
        //return this.transactionRepository.save(entities);
    }

 
 
    private modelToEntity(model: ITransactionModel): TransactionEntity {
        const properties = JSON.parse(JSON.stringify(model)) as TransactionProperties;
        return {...properties} as TransactionEntity;
    }
    
      private entityToModel(entity: TransactionEntity): ITransactionModel {
        return this.transactionFactory.reconstitute({...entity});
      }
  
}