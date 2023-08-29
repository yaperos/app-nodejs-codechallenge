import { Body, Controller, Logger, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { TransactionResponse } from 'src/common/transaction.type';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from 'src/dto/transaction.dto';
import { TransactionService } from 'src/services/transaction.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    return await this.transactionService.create(createTransactionDto);
  }

  @EventPattern('transaction_approved')
  public async transactionCreated(
    @Payload() payload: UpdateTransactionDto,
  ): Promise<void> {
    Logger.log(
      `INFO [transaction_approved]: ${payload.transactionExternalId}  `,
      TransactionController.name,
    );

    await this.transactionService.update(payload);
  }
}
