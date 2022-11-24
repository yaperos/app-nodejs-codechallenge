import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { get } from 'http';
import { AppService } from './app.service';
import { TransactionEvent } from './transactionEvent';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  // @MessagePattern('anti-fraud')
  // async handleantiFraud(data: TransactionEvent) {
    //   let transactionStatusChanged;
    //   const amount = data.value;
    //   if (amount > 1000) {
      //     transactionStatusChanged = {
        //       ...data,
        //       transactionStatus: 'rejected',
        //     };
        //   } else {
  //     transactionStatusChanged = {
    //       ...data,
    //       transactionStatus: 'approved',
    //     };
  //   }
  //   return transactionStatusChanged;
  // }
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @EventPattern('transactionValidated')
  handleTransactionValidated(data: any) {
    this.appService.handleTrasactionCreated(data.value);
  }
  onModuleInit() {
    
  }
}