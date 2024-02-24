import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Headers } from '@nestjs/common';
import { TransactionCreateRequest } from 'src/common/dto/request/transactionCreateRequest.dto';
import { TransactionResponse } from 'src/common/dto/response/transactionResponse.dto';
import { TransactionService } from 'src/core/service/transaction.service';

@Controller('/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @Headers('trace_id') traceId: string,
    @Body() transactionRequest: TransactionCreateRequest): Promise<void> {
     await this.transactionService.createTransaction(traceId, transactionRequest);
  }

  @Get(':code')
  @HttpCode(HttpStatus.OK)
  async getTransactionByCode( 
    @Headers('trace_id') traceId: string, 
    @Param('code', new ParseUUIDPipe()) code: string): Promise<TransactionResponse> {
    return await this.transactionService.findTransactionResponse(traceId, code);
  }

}
