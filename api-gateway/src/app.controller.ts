import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('TRANSACTION_CLIENT') private transactionClient: ClientKafka,
    private readonly appService: AppService,
  ) {}
  async onModuleInit() {
    this.transactionClient.subscribeToResponseOf('create_transaction');
    await this.transactionClient.connect();
  }
  onModuleDestroy() {
    this.transactionClient.close();
  }
  @Get()
  findAll() {
    return this.appService.findAll();
  }
  @Get(':id')
  async findOne(@Param() id) {
    console.log(id);
    return await this.appService.findOne(id.id);
  }
  @Post()
  async create(@Body() transaction: any) {
    const res = await new Promise((resolve) => {
      this.transactionClient
        .send('create_transaction', this.appService.create(transaction))
        .subscribe((ms) => {
          resolve(ms);
        });
    });

    return res;
  }
}
