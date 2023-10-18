import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionStatus } from "../domain/enums/transaction-status.enum";
import { TransactionModel } from "../domain/transaction.model";
import { TransactionRepository } from "../domain/transaction.repository";
import { CreateTransactionInput } from "./dto/create-transaction.input";
import { Transaction } from "./entities/transaction.entity";

@Injectable()
export class TypeOrmRepository implements TransactionRepository {

  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) { }

  async save(transaction: CreateTransactionInput): Promise<TransactionModel> {
    return await this.repository.save(transaction);
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.repository.update({ id }, { status });
  }

  async findOne(id: string): Promise<TransactionModel> {
    return await this.repository.findOne({ where: { id } });
  }
}