import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { CreateTransactionDto } from '..//DTOs/createTransaction.dto';
import { RequestTransactionDto } from '..//DTOs/requestTransaction.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { TransactionEntity } from '../entity/transaction.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPIC } from 'src/util/enum/kafka.enum';
import { TransactionStatus } from 'src/util/enum/transaction-status.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/transaction')
  @HttpCode(200)
  @ApiCreatedResponse({ type: TransactionEntity })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.appService.create(createTransactionDto);
  }

  @Post('/last-transaction')
  @ApiCreatedResponse({ type: TransactionEntity })
  getLastTransaction(@Body() requestTransactionDto: RequestTransactionDto) {
    return this.appService.getLastTransaction(requestTransactionDto);
  }

  @MessagePattern(KAFKA_TOPIC.VALIDATED_ANTIFRAUD)
  async handleAntifraudResponse(@Payload() payload: any) {
    let transaction = payload
    if(transaction.status === TransactionStatus.REJECTED
      || transaction.status === TransactionStatus.APPROVED){
        await this.prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: transaction.status
          },
        });
        Logger.log('info transaction updated')
    } else {
        Logger.warn('the transaction dont have a valid status')
    }
  }
}
