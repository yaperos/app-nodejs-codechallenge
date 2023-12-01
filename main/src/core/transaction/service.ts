import { TransactionRepository } from './repository'
import { ApiError } from '../errors/public'
import { CreateTransactionQuery, SearchTransactionQuery, Transaction } from './query'
import { RetrieveTransactionResponse,SearchTransactionsResponse, CreateTransactionResponse, DeleteTransactionResponse } from './response'
import { TransactionStatus } from '@prisma/client'

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository) { }

    async create(
        query: CreateTransactionQuery
    ): Promise<CreateTransactionResponse> {
        try {
            const transaction = await this.transactionRepository.create(query)
            return { transaction }
        } catch (err) {
            return {
                error: new ApiError(err.message)
            }
        }
    }

    async getById(id: number): Promise<RetrieveTransactionResponse> {
        try {
            const transaction = await this.transactionRepository.getById(id)
            return { transaction }
        } catch (err) {
            return {
                error: new ApiError(err.message)
            }
        }
    }

    async search(
        query: SearchTransactionQuery
    ): Promise<SearchTransactionsResponse> {
        try {
            const transactions = await this.transactionRepository.search(query)

            const count = await this.transactionRepository.count({
                ids: query?.ids,
                status: query?.status,
            })

            const pagination = {
                total_items: count,
                total_pages: query?.limit
                    ? Math.ceil(count / query.limit)
                    : 1,
                page: query?.page ? query.page : 1,
            }
            return { transactions, pagination }
        } catch (err) {
            return {
                error: new ApiError(err.message)
            }
        }
    }

    async update(id: number, status: TransactionStatus): Promise<Transaction> {
        try {
            const transaction = await this.transactionRepository.update(id, status)
            return transaction
        } catch (err) {
            throw new ApiError(err.emssage)
        }
    }

    async delete(id: number): Promise<DeleteTransactionResponse> {
        try {
            const transaction = await this.transactionRepository.delete(id)
            return { transaction }
        } catch (err) {
            return {
                error: new ApiError(err.message)
            }
        }
    }
}
