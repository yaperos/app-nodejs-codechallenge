import { Controller, Get, HttpCode, HttpStatus,Inject,Injectable,OnModuleDestroy,OnModuleInit } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateTransactionEventIntegratedHandler } from './transaction/applications/eventintegrated/create.transaction.eventintegrated.handler';
import { KafkaService } from 'libs/KafkaModule';

@Injectable()
@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly kafkaService: KafkaService){
   
  }
  
  
  async onModuleInit() {
    //const consumerService = new ConsumerService('localhost:9092');
    const events= new CreateTransactionEventIntegratedHandler()
    this.kafkaService.consume('created.transaction','transaction', async(m) => {events.HandleCreateTransaction(m);})
    //consumerService.consume('created.transaction','transaction',
    //async(m) => {events.HandleCreateTransaction(m);})    
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