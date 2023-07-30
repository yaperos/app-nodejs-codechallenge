import { Injectable } from '@nestjs/common';
import { Ports, Entities } from 'src/domain/financial-transactions/create';
import { Repository } from 'typeorm';
import { TransactionType } from 'src/infra/db/entities/transaction-type.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateTransactionTypeAdapter implements Ports.TransactionTypePort {
  constructor(
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async getTransactionTypeByName(name: string): Promise<Entities.TransactionTypeId> {
    if (!name) return null;

    const transactionTypeId = await this.transactionTypeRepository.findOne({
      where: { type: Entities.Type[name] },
      select: ['id'],
    });

    return transactionTypeId ?? null;
  }
}

export const createTransactionTypeDbAdapterProvider = {
  provide: Ports.TransactionTypePort,
  useClass: CreateTransactionTypeAdapter,
};
