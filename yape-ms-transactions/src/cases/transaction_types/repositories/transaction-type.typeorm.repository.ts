import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Project */
import { TransactionTypeEntity, TransactionType } from '../models';
import { ITransactionTypeRepository } from './transaction-type.repository';

@Injectable()
export class TypeormTransactionTypeRepository
  implements ITransactionTypeRepository
{
  constructor(
    @InjectRepository(TransactionTypeEntity)
    private readonly ormRepo: Repository<TransactionTypeEntity>,
  ) {}

  private toDomain(entity: TransactionTypeEntity): TransactionType {
    return { id: entity.id, name: entity.name };
  }

  async findAll(): Promise<TransactionType[]> {
    const list = await this.ormRepo.find();

    return list.map((e) => this.toDomain(e));
  }

  async findById(id: number): Promise<TransactionType | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });

    return entity ? this.toDomain(entity) : null;
  }
}
