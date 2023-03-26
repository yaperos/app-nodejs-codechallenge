import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction, TransactionStatus } from '../entity/transaction.entity';
import { TransactionService } from '../services/transaction.service';

@Controller('api/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  getAllTransactions() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  async getTransaction(@Param('id') id: number) {
    const transaction: Transaction = await this.transactionService.findOneById(
      id,
    );

    const stateNameIndex = Object.values(TransactionStatus).indexOf(
      transaction.transactionStatus,
    );

    const response: TransactionResponseDto = {
      transactionExternalId: transaction.id,
      transactionType: { name: '' },
      transactionStatus: {
        name: `${Object.keys(TransactionStatus)[stateNameIndex]}`,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };

    return response;
  }

  @Post()
  saveTransaction(@Body() body: CreateTransactionDto) {
    return this.transactionService.create(body);
  }

  @EventPattern('transaction.approved')
  async approvedTransaction(data: any) {
    Logger.debug(
      'Approved transaction :',
      JSON.stringify({ id: data.id, value: data.value }),
    );
    this.transactionService.updateState(data.id, TransactionStatus.APPROVED);
  }

  @EventPattern('transaction.rejected')
  async rejectedTransaction(data: any) {
    Logger.debug(
      'Rejected transaction event:',
      JSON.stringify({ id: data.id, value: data.value }),
    );
    this.transactionService.updateState(data.id, TransactionStatus.REJECTED);
  }
}
