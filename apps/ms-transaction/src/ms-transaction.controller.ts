import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { MsTransactionService } from './ms-transaction.service';
import { StatusResponse, TransactionRequest } from './dto/transaction.dto';

@Controller('ms-api')
export class MsTransactionController {
  constructor(private readonly msTransactionService: MsTransactionService) {}

  @Post('create')
  async createTransaction(
    @Body() transactionRequest: TransactionRequest,
  ): Promise<string> {
    return this.msTransactionService.createTransaction(transactionRequest);
  }

  @Get('status/:requestId')
  async getStatus(
    @Param('requestId') requestId: string,
  ): Promise<StatusResponse> {
    const transaction =
      await this.msTransactionService.getStatusTransaction(requestId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found', 'ms-transaction');
    }

    return transaction;
  }
}
