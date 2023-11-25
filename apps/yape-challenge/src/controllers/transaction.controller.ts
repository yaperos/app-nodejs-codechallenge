import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { TransactionService } from '../services/transaction.service';
import { TransaccionDto } from '../dto';

@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly transactionSvc: TransactionService) {}

  @Get()
  async getAllTransaction() {
    return this.transactionSvc.getAllTransaction();
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return this.transactionSvc.getTransaction(id);
  }

  @Post('create')
  newTransaction(@Body() body: TransaccionDto) {
    return this.transactionSvc.newTransaction(body);
  }

  @Put('update-status/:id')
  updateStatusTransaction(
    @Param('id') id: string,
    @Body() body: { status: number },
  ) {
    return this.transactionSvc.updateStatusTransaction(id, body);
  }

  @Delete('clear')
  DeleteTransaction() {
    return this.transactionSvc.DeleteTransaction();
  }
}
