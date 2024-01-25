import { Injectable } from "@nestjs/common";
import { TransactionRepository } from "src/domain/Transaction.repository";
import { TransactionValue } from "src/domain/Transaction.value.";
import { PostgresRepository } from "src/infraestructure/repository/postgre.repository";

@Injectable()
export class TransactionUseCase implements TransactionRepository {
    constructor(private readonly trxRepository:PostgresRepository){

    }

    public registerTrx=async(data:any):Promise<any>=>{
        const trxValue = new TransactionValue(data);
        const trxCreated=await this.trxRepository.registerTrx(trxValue);
        return trxCreated;
    }

    public findTrx=async (id: number): Promise<any> =>{
        const trx=await this.trxRepository.findTrx(id);
        return trx;
    }

}