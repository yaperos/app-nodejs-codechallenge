import {
    Resolver,
    Args,
    Query,
    Mutation,
} from '@nestjs/graphql'
import { TransferService } from 'src/core/transfer/service'
import { TransferSqlRepository } from 'src/repos/transfer/repository';
import { Transfer, CreateTransferPayload } from 'src/core/transfer/query'
import { CreateTransferArgs, DeleteTransferArgs, SearchTransfersArgs } from './request'
import { InternalServerErrorGraphQL } from 'src/core/errors';
import { DeleteTransferPayload, TransferConnection } from './response';

@Resolver(of => Transfer)
export class TransferResolver {
    private transferService: TransferService
    constructor(transferRepository: TransferSqlRepository) {
        this.transferService = new TransferService(transferRepository)
    }

    @Query(returns => TransferConnection, {
        nullable: true,
        name: 'transfers',
    })
    async searchTransfers(
        @Args() args: SearchTransfersArgs
    ): Promise<TransferConnection> {
        const searchResponse = await this.transferService.search({
            ...args,
            ids: args?.query?.ids,
            names: args?.query?.names,
        })

        if (searchResponse.error) {
            throw new InternalServerErrorGraphQL(searchResponse.error.message)
        }
        return TransferConnection.fromApiResponse(searchResponse)
    }

    @Mutation(returns => CreateTransferPayload, { nullable: true })
    async createTransfer(
        @Args() args: CreateTransferArgs
    ): Promise<CreateTransferPayload> {
        const createResponse = await this.transferService.create(args.input)

        if (createResponse.error && createResponse.error.code === 'API_ERROR') {
            throw new InternalServerErrorGraphQL(createResponse.error.message)
        }

        return CreateTransferPayload.fromApiResponse(createResponse)
    }

    @Mutation(returns => DeleteTransferPayload, { nullable: true })
    async deleteTransfer(
        @Args() args: DeleteTransferArgs
    ): Promise<DeleteTransferPayload> {
        const deleteResponse = await this.transferService.delete(args.id)

        if (deleteResponse.error && deleteResponse.error.code === 'API_ERROR') {
            throw new InternalServerErrorGraphQL(deleteResponse.error.message)
        }

        return DeleteTransferPayload.fromApiResponse(deleteResponse)
    }
}
