import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionTypeModel } from '../database/models/transaction-type.model';
import { ITransactionTypeRepository } from '../../domain/repositories/itransaction-type.repository';
import { TransactionType } from '../../domain/entities/transaction-type.entity';

@Injectable()
export class TransactionTypeRepository implements ITransactionTypeRepository {
  constructor(
    @InjectRepository(TransactionTypeModel)
    private readonly transactionStatusRepository: Repository<TransactionTypeModel>,
  ) {}

  async findById(id: number): Promise<TransactionType> {
    const typeModel = await this.transactionStatusRepository.findOneBy({
      id: id,
    });

    return this.mapModelToDomain(typeModel);
  }

  private mapModelToDomain(model: TransactionTypeModel): TransactionType {
    return new TransactionType(model.id, model.name);
  }
}
