import { Transaction as TransactionType } from "../../../../Shared/types/transaction";
import { PrismaClient } from "../../../../../prisma/generated/client";
import { v4 as uuidv4 } from 'uuid';
import { Logger } from "../../../../Shared/infrastructure/Logger";
import { ResponseDTO, createSuccessResponse, createErrorResponse } from "../../../../Shared/models/responses";
import { Messages } from "../../../../Shared/utils/messages";


export class TransactionRepository {
  private prisma: PrismaClient;
  private logger: Logger;
 
  constructor(logger: Logger, prisma: PrismaClient) {
    this.prisma = prisma;
    this.logger = logger;
  }
  
  async createTransaction(transaction: TransactionType): Promise<ResponseDTO> {
    const uuid = uuidv4();
    this.logger.debug(`Attempting to create transaction with UUID: ${uuid}`);

    let missingFields = '';
    if (!transaction.accountExternalIdDebit) missingFields += 'accountExternalIdDebit, ';
    if (!transaction.accountExternalIdCredit) missingFields += 'accountExternalIdCredit, ';
    if (!transaction.transferTypeId) missingFields += 'transferTypeId, ';
    if (transaction.value === undefined) missingFields += 'value, ';

    if (missingFields) {
        missingFields = missingFields.slice(0, -2); 
        return createErrorResponse(`Missing required fields: ${missingFields}`);
    }

    try {
      const createdTransaction = await this.prisma.transaction.create({
        data: {
          uuid: uuid,
          accountExternalIdDebit: transaction.accountExternalIdDebit,
          accountExternalIdCredit: transaction.accountExternalIdCredit,
          transferTypeId: transaction.transferTypeId,
          value: transaction.value,
          status: transaction.status || 'pending',
        },
      });
      this.logger.debug(`${Messages.SendTransactionCreated}: ${uuid}`);
      return createSuccessResponse(Messages.SendTransactionCreated, createdTransaction);
    } catch (error) {
      this.logger.error(`Error creating transaction: ${error}`);
      return createErrorResponse(`Error creating transaction`);
    }
  }

  async getTransactionByUuid(uuid: string): Promise<ResponseDTO> {
    try {
        const transaction = await this.prisma.transaction.findFirst({
            where: { uuid }
        });;
        if (transaction) {
            this.logger.debug(`Transaction found: ${JSON.stringify(transaction)}`);
            return createSuccessResponse('Transaction found', transaction);
        } else {
            this.logger.debug('Transaction not found');
            return createErrorResponse('Transaction not found');
        }
    } catch (error) {
        this.logger.error(`Error fetching transaction: ${error}`);
        return createErrorResponse('Error fetching transaction');
    }
}

  async updateTransactionStatus(uuid: string, status: string): Promise<ResponseDTO> {
    try {
        const transaction = await this.prisma.transaction.update({
            where: { uuid },
            data: { status }
        });
        return createSuccessResponse('Transaction status updated', transaction);
    } catch (error) {
        this.logger.error(`Error updating transaction status: ${error}`);
        return createErrorResponse('Error updating transaction status');
    }
  }

}
