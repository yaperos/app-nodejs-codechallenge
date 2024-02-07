import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionPostgres } from 'src/create/infra/transaction.entity';
import {
  TransactionToPostgres,
  TransactionMongoToDomain,
  TransactionToMongo,
} from 'src/shared/infrastructure/transaction.mapper';
import { TransactionMongo } from 'src/create/infra/transaction.mongo';
import { Transaction } from 'src/shared/domain/transaction.model';
import { TransactionRepository } from 'src/shared/domain/transaction.repository';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionInfraRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionPostgres, 'postgresConnection')
    private readonly postgres: Repository<TransactionPostgres>,
    @InjectRepository(TransactionMongo, 'mongoConnection')
    private readonly mongo: Repository<TransactionMongo>,
  ) {}

  async create(input: Transaction): Promise<void> {
    await this.postgres.insert(TransactionToPostgres.handle(input));
    await this.mongo.save(TransactionToMongo.handle(input));
    return this.mongo.find() as any;
  }

  async update(input: Transaction) {
    const _id = input.id;
    await this.postgres.insert(TransactionToPostgres.handle(input));
    await this.mongo.update({ _id }, TransactionToMongo.handle(input));
  }

  async getById(id: string): Promise<Transaction | null> {
    const _id = id;
    return this.mongo
      .findOne({ where: { _id } })
      .then((r) => (r ? TransactionMongoToDomain.handle(r) : null));
  }
}
