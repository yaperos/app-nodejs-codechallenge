import { TransferRepository } from './repository'
import { ApiError } from '../errors/public'
import { CreateTransferQuery, SearchTransferQuery } from './query'
import { SearchTransfersResponse, CreateTransferResponse, DeleteTransferResponse } from './response'

export class TransferService {
    constructor(private transferRepository: TransferRepository) { }

    async create(
        query: CreateTransferQuery
    ): Promise<CreateTransferResponse> {
        try {
            const transfer = await this.transferRepository.create(query)
            return { transfer }
        } catch (err) {
            return {
                error: new ApiError(err.message)
            }
        }
    }

    async search(
        query: SearchTransferQuery
    ): Promise<SearchTransfersResponse> {
        try {
            const transfers = await this.transferRepository.search(query)

            const count = await this.transferRepository.count({
                ids: query?.ids,
                names: query?.names,
            })

            const pagination = {
                total_items: count,
                total_pages: query?.limit
                    ? Math.ceil(count / query.limit)
                    : 1,
                page: query?.page ? query.page : 1,
            }
            return { transfers, pagination }
        } catch (err) {
            return {
                error: new ApiError(err.message)
            }
        }
    }

    async delete(id: number): Promise<DeleteTransferResponse> {
        try {
            const transfer = await this.transferRepository.delete(id)
            return { transfer }
        } catch (err) {
            return {
                error: new ApiError(err.message)
            }
        }
    }
}
