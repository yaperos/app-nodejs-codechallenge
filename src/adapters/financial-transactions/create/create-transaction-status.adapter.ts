import { Injectable } from '@nestjs/common';
import { Ports, Entities } from 'src/domain/financial-transactions/create';
import { Repository } from 'typeorm';
import { TransactionStatus } from '../../../infra/db/entities/transaction-status.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateTransactionStatusAdapter implements Ports.TransactionStatusPort {
  constructor(
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
  ) {}

  async getTransactionStatusByName(name: string): Promise<Entities.TransactionStatusId> {
    if (!name) return null;

    const transactionStatusId = await this.transactionStatusRepository.findOne({
      where: { status: Entities.StatusType[name] },
      select: ['id'],
    });

    return transactionStatusId ?? null;
  }
}

export const createTransactionStatusDbAdapterProvider = {
  provide: Ports.TransactionStatusPort,
  useClass: CreateTransactionStatusAdapter,
};
