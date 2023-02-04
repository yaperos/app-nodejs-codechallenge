import {PrismaService} from "../../../../../src/infrastructure/prisma/prisma.service";
import {CreateTransactionInput} from "../../../../common/dto/create_transaction_input";
import {TransactionStatus} from "../../../../common/enums/transaction-status";
import {Injectable} from "@nestjs/common";
import {ResponseAntiFraudInput} from "../../../../common/dto/response_anti_fraud.input";
import {ITransactionRepository} from "./ITransactionRepository";
import {Transaction} from "@prisma/client";
import { RetrieveTransaction } from "../entities/retrieve_transaction.entity"
import {TransactionMapper} from "../mappers/transactionMapper";
@Injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(private readonly prisma: PrismaService) {}
    async createTransaction(transaction: CreateTransactionInput): Promise<Transaction>{
        return this.prisma.transaction.create({ data :  {
                accountExternalIdDebit: transaction.accountExternalIdDebit,
                accountExternalIdCredit: transaction.accountExternalIdCredit,
                type: transaction.transferTypeId,
                value: transaction.value,
                status: TransactionStatus.PENDING as number,
            } })
    }

    async updateTransaction(transaction: ResponseAntiFraudInput): Promise<void> {
        await this.prisma.transaction.update({
            where: {
                transactionExternalId: transaction.transactionExternalId
            },
            data: {
                status: TransactionStatus[TransactionStatus[transaction.status]] ,
            }
        })
    }

    async findTransaction(externalId: string): Promise<RetrieveTransaction> {
        const data = await this.prisma.transaction.findFirst({
            where: {
                transactionExternalId: externalId
            }
        })
        return TransactionMapper.toDto(data)
    }
}