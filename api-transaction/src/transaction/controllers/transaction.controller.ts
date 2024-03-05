import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { AntifraudResponseDto } from "../dto";
import { TransactionService } from "../services/transaction.service";

@Controller("transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @EventPattern('transaction.update')
  async handleTransactionUpdate(@Payload() transaction: AntifraudResponseDto) {
    return await this.transactionService.update(transaction.id, {
      id: transaction.id,
      transactionStatus: transaction.transactionStatus
    });
  }
}