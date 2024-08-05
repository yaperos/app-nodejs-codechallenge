import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from '../../domain/entities/status.entity';
import { TransactionStatusModel } from '../database/models/status.model';
import { ITransactionStatusRepository } from '../../domain/repositories/istatus.repository';

@Injectable()
export class TransactionStatusRepository
  implements ITransactionStatusRepository
{
  constructor(
    @InjectRepository(TransactionStatusModel)
    private readonly transactionStatusRepository: Repository<TransactionStatusModel>,
  ) {}

  async findById(id: number): Promise<TransactionStatus> {
    const statusModel = await this.transactionStatusRepository.findOneBy({
      id: id,
    });

    return this.mapModelToDomain(statusModel);
  }

  private mapModelToDomain(model: TransactionStatusModel): TransactionStatus {
    return new TransactionStatus(model.id, model.name);
  }
}
