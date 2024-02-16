import { Controller } from "@nestjs/common";
import TransactionService from "./transaction.service";

@Controller("transaction")
export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
}
