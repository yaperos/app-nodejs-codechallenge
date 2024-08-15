import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { TransactionDTO } from 'src/dtos/transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionMapper } from 'src/mappers/transaction.mapper';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private transaction: Repository<TransactionEntity>,
    private mapper: TransactionMapper,
  ) {}

  async saveTransaction(dto: TransactionDTO): Promise<TransactionEntity> {
    const transaction = this.mapper.dtoToEntity(dto);
    return await this.transaction.save(transaction);
  }
}
