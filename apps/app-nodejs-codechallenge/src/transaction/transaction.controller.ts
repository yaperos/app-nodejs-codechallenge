import { Controller, Get, Query } from "@nestjs/common";
import TransactionService from "./transaction.service";
import PaginationDto from "../common/dto/pagination.dto";
import { IPaginationOptions } from "nestjs-typeorm-paginate";

@Controller("transactions")
export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  public async listTransactions(@Query() dto: PaginationDto) {
    return await this.transactionService.listTransactions(
      dto as IPaginationOptions,
    );
  }
}
