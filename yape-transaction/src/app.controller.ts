import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StatusDto } from './dto/status.dto';
import { TransactionInputDto } from './dto/transaction.input';
import { TransactionDto } from './dto/transaction.dto';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}


  @Get("list-all")
  public async getTransactions(): Promise<TransactionDto[]> {
    return this.appService.getAllTransactions();
  }

  @UsePipes(new ValidationPipe({whitelist: true}))
  @Post("add")
  public async addTransaction(@Body() transactionInputDto: TransactionInputDto,) {
    return this.appService.create(transactionInputDto);
  }


  @MessagePattern('topic_status.approved')
  public async validateTransactionApproved( @Payload() message: StatusDto,): Promise<void> {
    console.log('Aprobado!!!!');
    await this.appService.transactionApproved(message);
  }
  @MessagePattern('topic_status.rejected')
  public async validateTransactionRejected( @Payload() message: StatusDto,): Promise<void> {
    console.log('Rechazado!!!!');
    await this.appService.transactionRejected(message);
  }
}