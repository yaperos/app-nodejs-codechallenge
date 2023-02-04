import { Injectable } from "@nestjs/common";
import {CreateTransactionInput} from "../../../common/dto/create_transaction_input";
import {PrismaService} from "../../../../src/infrastructure/prisma/prisma.service";

@Injectable()
export class TransactionLogService {
    constructor(private readonly prisma: PrismaService) {}
    async create(transaction: CreateTransactionInput, status){
        await this.prisma.transactionLog.create({ data :  {
                data: JSON.stringify(transaction),
                status: status
            } })
    }
}