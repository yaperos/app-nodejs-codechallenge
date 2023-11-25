import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TransactionStatusService } from '../services';

@Controller('api/transactions-status')
export class TransactionStatusController {
  constructor(
    private readonly transactionStatusSvc: TransactionStatusService,
  ) {}

  @Get()
  async getAllTransactionStatus() {
    return this.transactionStatusSvc.getAllTransactionStatus();
  }

  @Get(':id')
  async getTransactionStatus(@Param('id') id: number) {
    return this.transactionStatusSvc.getTransactionStatus(id);
  }

  @Post('create')
  newTransactionStatus(@Body() body: { statusName: string }) {
    return this.transactionStatusSvc.newTransactionStatus(body);
  }

  @Put('update-status/:id')
  updateStatusTransaction(@Param('id') id: number, @Body() statusName: string) {
    return this.transactionStatusSvc.updateStatusTransaction(id, statusName);
  }

  @Delete('clear')
  DeleteStatus() {
    return this.transactionStatusSvc.DeleteAllStatus();
  }
}
