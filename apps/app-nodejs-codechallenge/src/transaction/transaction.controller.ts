import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import TransactionService from "./transaction.service";
import PaginationDto from "../common/dto/pagination.dto";
import { IPaginationOptions } from "nestjs-typeorm-paginate";
import CreateTransactionDto from "./dto/create-transaction.dto";

@Controller("transactions")
export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  public async listTransactions(@Query() dto: PaginationDto) {
    return await this.transactionService.listTransactions(
      dto as IPaginationOptions,
    );
  }

  @Post()
  public async createTransaction(@Body() dto: CreateTransactionDto) {
    return await this.transactionService.createTransaction(dto);
  }
}
