import { TransactionStatus } from '@prisma/client';
import { TransactionRepository } from './repository'
import { ApiError } from '../errors/public'
import { Transaction } from './query'

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository ) {}

    async getById(id: number): Promise<Transaction> {
        try {
            const transaction = await this.transactionRepository.getById(id)
            return transaction
        } catch (err) {
            throw new ApiError(err.emssage)
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
}
