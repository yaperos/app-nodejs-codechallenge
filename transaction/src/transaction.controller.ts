import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PaginatorDto } from './dto/paginator.dto';
import { TransactionService } from './transaction.service';
import { Transaction } from './entity/transaction.entity';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { ResultPaginator } from './dto/result-paginator.dto';
import { TransactionValidateDto } from './dto/transaction-validate.dto';
import { TOPIC_VALIDATION } from './constants/topic-validation.enum';
import { ControllerSupport } from './support/controller.support';
import { TransactionDto } from './dto/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOkResponse({ type: ResultPaginator<TransactionDto> })
  @Get()
  async findAll(
    @Query() paginator: PaginatorDto,
  ): Promise<ResultPaginator<TransactionDto>> {
    const [listTransactions, total] = await this.transactionService.findAll(
      paginator,
    );
    const listTransactionsResponse =
      ControllerSupport.getListTransactionResponse(listTransactions);

    return new ResultPaginator(listTransactionsResponse, total);
  }

  @ApiOkResponse({ type: TransactionDto })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<TransactionDto> {
    return ControllerSupport.getTransactionResponse(
      await this.transactionService.findById(id),
    );
  }

  @ApiOkResponse({ type: TransactionDto })
  @Post()
  async create(
    @Body() transactionCreatePayload: TransactionCreateDto,
  ): Promise<TransactionDto> {
    return ControllerSupport.getTransactionResponse(
      await this.transactionService.create(transactionCreatePayload),
    );
  }

  @UsePipes(new ValidationPipe())
  @MessagePattern(TOPIC_VALIDATION.TRANSACTION_APPROVED)
  public transactionApproved(@Payload() payload: TransactionValidateDto) {
    return this.transactionService.transactionApproved(payload);
  }

  @UsePipes(new ValidationPipe())
  @MessagePattern(TOPIC_VALIDATION.TRANSACTION_REJECTED)
  public transactionRejected(@Payload() payload: TransactionValidateDto) {
    return this.transactionService.transactionRejected(payload);
  }
}
