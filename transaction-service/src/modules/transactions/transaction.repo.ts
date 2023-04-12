import {Injectable} from "@nestjs/common";
import {TransactionService} from "./service/transaction.service";
import {transactionDTO} from "./controller/transaction.controller";

@Injectable()
export class TransactionRepo {
  constructor(
    private readonly transactionService: TransactionService,
  ) {
  }

  async createTransaction(transactionPayload: transactionDTO) {
    return await this.transactionService.createTransaction(transactionPayload);
  }
}