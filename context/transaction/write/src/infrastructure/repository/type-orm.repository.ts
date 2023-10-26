import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TransactionEntity } from "../entities/transaction.entity";
import { TransactionModel } from "../../domain/models/transaction.model";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { TransactionStatus } from "../../domain/enums/transaction-status.enum";

@Injectable()
export class TypeOrmRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
  ) {}

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
