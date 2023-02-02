import {Body, Controller, Get} from '@nestjs/common';
import { YapeTransactionService } from './yape-transaction.service';
import {MessagePattern} from "@nestjs/microservices";
import {TxCreateDto} from "@yape/yape-domain/dto/tx.create.dto";
import {TxEntity} from "@yape/yape-domain/entity/tx.entity";
import {TxDto} from "@yape/yape-domain/dto/tx.dto";

@Controller()
export class YapeTransactionController {
  constructor(private readonly yapeTransactionService: YapeTransactionService) {}

  @MessagePattern({cmd: 'tx.create'})
  create(@Body() tx: TxCreateDto) {
    console.log('tx create');
    return this.yapeTransactionService.create(tx);
  }

  @MessagePattern({cmd: 'tx.validate'})
  async validate(@Body() tx: any) {
    console.log('tx validate');
    return this.yapeTransactionService.validate(tx);
  }

  @MessagePattern({cmd: 'tx.retrieve'})
  retrieve(@Body() tx: TxEntity): Promise<TxDto> {
    console.log('tx retrieve');
    return this.yapeTransactionService.retrieve(tx.id);
  }
}
