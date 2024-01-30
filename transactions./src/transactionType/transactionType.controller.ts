import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { CreateTransactionTypeDto } from './dto';
import { TransactionTypeService } from './transactionType.service';

@Controller('transactionTypes')
export class TransactionTypeController {
  constructor(
    private transactionTypeService: TransactionTypeService,
  ) {}

  @Post()
  createTransactionType(
    @Body() dto: CreateTransactionTypeDto,
  ) {
    return this.transactionTypeService.createTransactionType(
      dto,
    );
  }

  @Get()
  getTransactionTypes() {
    return this.transactionTypeService.getAll();
  }
}
