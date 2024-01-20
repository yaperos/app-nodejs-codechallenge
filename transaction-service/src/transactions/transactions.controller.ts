import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from 'src/dtos/createTransaction.dto';
import { TransactionResponse } from 'src/interfaces/transaction-response.interface';
import { TransactionNotFoundException } from 'src/exceptions/transaction-not-found.exception';
import { ERROR_MESSAGES } from 'src/constants/error-messages.constants';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(
    @Body() transactionData: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    try {
      return await this.transactionsService.create(transactionData);
    } catch (error) {
      this.logger.error(
        `${ERROR_MESSAGES.TransactionCreateError}: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `${ERROR_MESSAGES.TransactionCreateError}: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string): Promise<TransactionResponse> {
    try {
      return await this.transactionsService.findOne(id);
    } catch (error) {
      this.logger.error(
        `${ERROR_MESSAGES.TransactionNotFoundError}: ${error.message}`,
      );
      if (error instanceof TransactionNotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: ERROR_MESSAGES.TransactionNotFoundError,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.error(
        `${ERROR_MESSAGES.InternalServerError}: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: ERROR_MESSAGES.InternalServerError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
