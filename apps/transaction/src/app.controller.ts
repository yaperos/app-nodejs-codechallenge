import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Controller('transactions')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.appService.createTransaction(createTransactionDto);
  }

  @EventPattern('transaction_status_update')
  handleTransactionStatusUpdate(@Payload() data: any) {
    this.appService.handleTransactionStatusUpdate(data);
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    const transaction = await this.appService.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) return null;

    return {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.transferTypeId,
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
