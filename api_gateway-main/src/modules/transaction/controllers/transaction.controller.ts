import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { catchError } from 'rxjs';
import { CreateTransactionRequestDto } from '../dtos/create-transaction-request.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(`detail/:id`)
  getTransaction(@Param('id') id: string) {
    return this.transactionService.getTransaction(id)?.pipe(
      catchError((error) => {
        throw new BadRequestException(error);
      }),
    );
  }

  @Post('create')
  createTransaction(@Body() body: CreateTransactionRequestDto) {
    return this.transactionService.createTransaction(body)?.pipe(
      catchError((error) => {
        throw new BadRequestException(error);
      }),
    );
  }
}
