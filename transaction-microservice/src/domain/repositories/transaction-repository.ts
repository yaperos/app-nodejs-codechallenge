import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  TransactionCreateInput,
  TransactionPayload,
  TransactionUpdateInput,
} from '../types/transaction.type';

@Injectable()
export class TransactionRepository {
  private readonly logger: Logger;

  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(TransactionRepository.name);
  }

  async getAll() {
    return this.prismaService.transaction.findMany();
  }

  async create(params: TransactionCreateInput): Promise<TransactionPayload> {
    try {
      const createdTransaction = await this.prismaService.transaction.create({
        data: params,
      });

      return createdTransaction;
    } catch (error) {
      this.logger.error(error);

      throw new UnprocessableEntityException(error.message);
    }
  }

  async update(params: TransactionUpdateInput): Promise<TransactionPayload> {
    try {
      const { uuid, ...remainingParams } = params;
      const updatedTransaction = await this.prismaService.transaction.update({
        where: { uuid: uuid as string },
        data: remainingParams,
      });

      return updatedTransaction;
    } catch (error) {
      this.logger.error(error);

      throw new UnprocessableEntityException(error.message);
    }
  }
}
