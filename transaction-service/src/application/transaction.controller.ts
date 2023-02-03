import { Body, Controller, Post, Logger, Get, Param } from '@nestjs/common';
import { CreateTransactionDto } from '../domain/dto/create-transaction.dto';
import { TransactionService } from '../domain/transaction.service';
import { EventPattern } from '@nestjs/microservices';
import { UpdateTransactionDto } from '../domain/dto/update-transaction.dto';
import { GetTransactionDto } from '../domain/dto/get-transaction.dto';
import { ShowTransactionDto } from '../domain/dto/show-transaction.dto';
import { LoggerService } from 'src/infraestructure/logger/logger.service';

@Controller('transaction')
export class TransactionController {
  private context = 'TransactionController';

  constructor(
    private readonly transactionService: TransactionService,
    private readonly logger: LoggerService,
  ) {}

  @Post('add')
  createTransaction(
    @Body() transaction: CreateTransactionDto,
  ): Promise<ShowTransactionDto> {
    const context = `${this.context}-createTransaction`;
    this.logger.log(context, 'start', {
      CreateTransactionDto: transaction,
    });

    return this.transactionService
      .add(transaction)
      .then((createdTransaction) => {
        this.logger.log(context, 'end', {
          createdTransaction,
        });
        return createdTransaction;
      });
  }

  @EventPattern('update-transaction')
  validateTransaction(transaction: UpdateTransactionDto) {
    const context = `${this.context}-validateTransaction`;
    this.logger.log(context, 'start', {
      UpdateTransactionDto: transaction,
    });

    this.transactionService
      .update(transaction)
      .then((updatedTransaction) => {
        this.logger.log(context, 'end', {
          updatedTransaction,
        });
        return true;
      })
      .catch((error) => {
        this.logger.error(context, 'end', {
          error,
        });
        return false;
      });
  }

  @Get(':transactionExternalId')
  async getTransaction(
    @Param() getTransactionDto: GetTransactionDto,
  ): Promise<ShowTransactionDto> {
    const context = `${this.context}-createTransaction`;
    this.logger.log(context, 'start', {
      GetTransactionDto: getTransactionDto,
    });

    return this.transactionService
      .getOne(getTransactionDto.transactionExternalId)
      .then((transaction) => {
        this.logger.log(context, 'end', {
          transaction,
        });
        return transaction;
      });
  }
}
