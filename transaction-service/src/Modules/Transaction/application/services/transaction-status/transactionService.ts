import { ServerResponse } from "../../../../../Shared/utils/serverResponse";
import { Logger } from "../../../../../Shared/infrastructure/Logger";
import { TransactionRepository } from "../../../domain/repositories/TransactionRepository";
import { PrismaClient } from "../../../../../../prisma/generated/client";

export class TransactionService { 
    private repository: TransactionRepository;
    
    constructor() {
        const prismaClient = new PrismaClient();
        const logger = new Logger();
        this.repository = new TransactionRepository(logger, prismaClient);
    }

    async getTransaction(uuid: string): Promise<ServerResponse> {
        try {
            const response = await this.repository.getTransactionByUuid(uuid);
            return response;
        } catch (error) {
            console.error('Error fetching transaction:', error);
            return { success: false, message: 'Error fetching transaction' };
        }
    }

    async updateTransactionStatus(uuid: string, status: string): Promise<ServerResponse> {
        return await this.repository.updateTransactionStatus(uuid, status);
    }
}

