import { Controller, Get, HttpCode, HttpStatus,Inject,Injectable,OnModuleDestroy,OnModuleInit } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { ConsumerService } from './consumer.service';
import { CreateTransactionEventIntegratedHandler } from './transaction/applications/eventintegrated/create.transaction.eventintegrated.handler';

@Injectable()
@Controller()
export class AppController implements OnModuleInit {
  constructor(){
   
  }
  
  
  async onModuleInit() {
    const consumerService = new ConsumerService('localhost:9092');
    const events= new CreateTransactionEventIntegratedHandler()
    consumerService.consume('created.transaction','transaction',
    async(m) => {events.HandleCreateTransaction(m);})    
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Get('health')
  health(): void {
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @Get('favicon.io')
  favicon(): void {
    return;
  }
}