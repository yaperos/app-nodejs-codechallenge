import { DataSource, Repository } from "typeorm";
import { IOrmTransactionRepository } from "./orm-transaction.repositorty.interface";
import { TransactionDto } from "../models/dto/transaction.dto";
import { Transaction } from "../models/entities/transaction.entity";
import { Injectable, UseInterceptors } from "@nestjs/common";
import { LoggingInterceptor } from "src/utils/logging.interceptor";

@UseInterceptors(LoggingInterceptor)
@Injectable()
export class OrmTransactionRepository extends Repository<Transaction> implements IOrmTransactionRepository {
    constructor(dataSource: DataSource) {
        super(Transaction, dataSource.createEntityManager());
    }
    
    saveTransaction(transactionDto: TransactionDto): Promise<TransactionDto> {
        return this.save(transactionDto);

    }


}