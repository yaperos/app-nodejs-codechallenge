import { Inject, Injectable } from "@nestjs/common";
import { ITransactionModel, TransactionProperties } from "src/transaction/domains/model/transaction.model";
import { ITransactionRepository } from "src/transaction/domains/repositories/transaction.repository";
import { TransactionEntity } from "../entities/transaction.entity";
import { TransactionFactory } from "src/transaction/domains/factory/transaction.factory";
import { readConnection, writeConnection } from "libs/DatabaseModule";
import { StatusTransactionModel } from "src/transaction/domains/model/statustransaction.model";

@Injectable()
export class TransactionRepository implements ITransactionRepository
{
    //constructor( @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>) {}
   
    @Inject() 
    private readonly transactionFactory: TransactionFactory;

    async updateStatusTransaction(model: StatusTransactionModel): Promise<void>
    {
        console.log('updating transaction');
        let entitie = await writeConnection.manager.getRepository(TransactionEntity).findOneBy({ id: model.id });        
        entitie.status = model.status;
        console.log(entitie);
        entitie = await writeConnection.manager.getRepository(TransactionEntity).save(entitie);
        console.log(entitie);
        console.log('updated transaction');
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