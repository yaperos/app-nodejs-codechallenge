import {Body, Controller, Get} from '@nestjs/common';
import { YapeTransactionService } from './yape-transaction.service';
import {MessagePattern} from "@nestjs/microservices";
import {TxCreateDto} from "@yape/yape-domain/dto/tx.create.dto";

@Controller()
export class YapeTransactionController {
  constructor(private readonly yapeTransactionService: YapeTransactionService) {}

  @MessagePattern({cmd: 'tx.create'})
  create(@Body() tx: TxCreateDto) {
    console.log('tx create');
    console.log(tx);
    return this.yapeTransactionService.create(tx);
  }

  @MessagePattern({cmd: 'tx.validate'})
  async validate(@Body() tx: any) {
    console.log('tx validate');
    console.log(tx);
    return this.yapeTransactionService.validate(tx);
  }
}
