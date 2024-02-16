import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Transaction from "./entities/transaction.entity";
import { Repository } from "typeorm";

@Injectable()
export default class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  public listTransactions = async () => {
    return await this.transactionRepository.find();
  };
}
