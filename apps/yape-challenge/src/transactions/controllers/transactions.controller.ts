import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { TransaccionDto } from '../dto';
import { TransaccionEntity } from '../entities';
import { MessagePattern } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionSvc: TransactionService) {}

  @Get()
  async getAllTransaction(): Promise<TransaccionEntity[]> {
    return this.transactionSvc.getAllTransactions();
  }

  @Get(':id')
  async getTransaction(@Param() id: string) {
    return this.transactionSvc.getTransaction(id);
  }

  //@Post()
  @MessagePattern({ cmd: 'transactions:create' })
  newTransaction(@Body() body: TransaccionDto) {
    console.log('entro aqui');
    return this.transactionSvc.newTransaction(body);
  }

  @Put()
  updateStatusTransaction(
    @Param('id') id: string,
    @Body() body: TransaccionDto,
  ) {
    return this.transactionSvc.updateStatusTransaction(id, body);
  }
}
