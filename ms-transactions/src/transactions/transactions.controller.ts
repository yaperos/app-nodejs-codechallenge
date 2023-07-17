import { Controller, Get, Param, Post, Body, Delete, NotFoundException, BadRequestException, Put } from '@nestjs/common';

import { TransactionsService } from './transactions.service';
import { Transaction } from './transactions.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FormattedTransaction } from './transactions.interface';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    try {

      return await this.transactionService.getAllTransactions();

    } catch (error) {

      throw new BadRequestException('Invalid request');

    }
  }

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<FormattedTransaction> {
    try {

      const transaction = await this.transactionService.createTransaction(createTransactionDto);
      
      const formattedTransaction = this.transactionService.getFormattedTransaction(transaction);
      
      return formattedTransaction;

    } catch (error) {

      throw new BadRequestException('Invalid request');

    }
  }

  @Get(':transactionExternalId')
  async getTransactionById(@Param('transactionExternalId') transactionExternalId: string): Promise<FormattedTransaction> {
    try {

      const transaction = await this.transactionService.getTransactionById(transactionExternalId);

      const formattedTransaction = this.transactionService.getFormattedTransaction(transaction);
      
      return formattedTransaction;

    } catch (error) {

      throw new NotFoundException('Transaction not found');

    }
  }

  @Put(':transactionExternalId')
  async updateTransaction(@Param('transactionExternalId') transactionExternalId: string, @Body() updateTransactionDto: UpdateTransactionDto,): Promise<Transaction> {
    try {

      return await this.transactionService.updateTransaction(transactionExternalId, updateTransactionDto);

    } catch (error) {

      throw new BadRequestException('Invalid request');

    }
  }

  @Delete(':transactionExternalId')
  async deleteTransaction(@Param('transactionExternalId') transactionExternalId: string): Promise<void> {
    try {

      await this.transactionService.deleteTransaction(transactionExternalId);

    } catch (error) {

      throw new BadRequestException('Invalid request');

    }
  }
}