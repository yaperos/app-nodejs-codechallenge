import { Injectable } from "@nestjs/common";
import {PrismaService} from "../../../../../src/infrastructure/prisma/prisma.service";
import {ITransactionLogRepository} from "./ITransactionLogRepository";

@Injectable()
export class TransactionLogRepository implements ITransactionLogRepository{
    constructor(private readonly prisma: PrismaService) {}

    async create(transaction: any, status: string){
        await this.prisma.transactionLog.create({ data :  {
                data: JSON.stringify(transaction),
                status: status
            } })
    }

}