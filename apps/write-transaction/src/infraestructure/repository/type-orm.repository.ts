import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionStatus } from "../../domain/enums/transaction-status.enum";
import { TransactionModel } from "../../domain/models/transaction.model";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { TransactionEntity } from "../entities/transaction.entity";

@Injectable()
export class TypeOrmRepository implements TransactionRepository {

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
  ) { }

  async save(transaction: CreateTransactionDto): Promise<TransactionModel> {
    return await this.repository.save(transaction);
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.repository.update({ id }, { status });
  }

  async findOne(id: string): Promise<TransactionModel> {
    return await this.repository.findOne({ where: { id } });
  }
}