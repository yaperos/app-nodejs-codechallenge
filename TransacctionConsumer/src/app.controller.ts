import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionDto } from './domain/models/dto/transaction.dto';
import { TransactionService } from './application/services/transaction.service';
import { LoggingInterceptor } from './utils/logging.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';

/**
 * Controllers are responsible for handling incoming
 * requests and returning responses to the client.
 *
 * @export
 * @class AppController
 */
@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  /**
   * Creates an instance of AppController.
   * @param {AppService} appService
   * @memberof AppController
   */
  constructor(private readonly transactionService: TransactionService,
    private readonly appService: AppService) { }

  /**
   * function get service health to k8s
   *
   * @return {*}  {string}
   * @memberof AppController
   */
  @Get()
  getHealth(): string {
    return this.appService.getHealth();
  }


  @MessagePattern(process.env.topic ? process.env.topic : 'transaction-topic')
  processTransactionK(@Payload() transaction : TransactionDto) {

    return this.transactionService.processTransaction(transaction)
  }

}
