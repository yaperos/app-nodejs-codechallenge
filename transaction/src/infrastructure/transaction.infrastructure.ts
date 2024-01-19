import { AppService } from "src/app.service";
import { MapperDto } from "./dtos/mapper.dto";
import { Transaction } from "src/domain/transaction";
import { TransactionRepository } from "src/domain/transaction.repository";
import { TransactionEntity } from "./entities/transaction.entity";


export class TransactionInfrastructure implements TransactionRepository{
    async save(tr: Transaction): Promise<Transaction> {
        const entityTr = MapperDto.domainToEntity(tr);
        const stored = await AppService.instConn.getRepository(TransactionEntity)
                             .save(entityTr);
        const domainTr = MapperDto.entityToDomain(stored);
        return domainTr;
    }

    async findById(transactionExternalId: string): Promise<Transaction> {
        const entityTr = await AppService.instConn.getRepository(TransactionEntity)
                                .findOne({where: { transactionExternalId }});
        return MapperDto.entityToDomain(entityTr);        
    }
}