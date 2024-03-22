import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { TransactionEntity } from "../../domain/entities/transaction.entity";

@Injectable()
export class TransactionRepository extends Repository<TransactionEntity>{

    constructor(public readonly dataSource: DataSource){
        super(TransactionEntity, dataSource.createEntityManager())
    }
    async findByTransactionalExternalId(id: number) {
        return this.findOneBy({
          id
        });
      }
    
}