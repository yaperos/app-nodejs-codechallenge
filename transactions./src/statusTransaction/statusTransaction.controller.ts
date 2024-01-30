import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { CreateStatusTransactionDto } from './dto';
import { StatusTransactionService } from './statusTransaction.service';

@Controller('statusTransactions')
export class StatusTransactionController {
  constructor(
    private statusTransactionService: StatusTransactionService,
  ) {}

  @Post()
  createStatusTransaction(
    @Body() dto: CreateStatusTransactionDto,
  ) {
    return this.statusTransactionService.createStatusTransaction(
      dto,
    );
  }

  @Get()
  getStatusTransactions() {
    return this.statusTransactionService.getAll();
  }
}
