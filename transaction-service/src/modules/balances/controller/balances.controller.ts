import {Controller, Inject, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {ClientKafka, MessagePattern, Payload} from '@nestjs/microservices';
import {BalanceService} from '../service/balance.service';

@Controller('balances')
export class BalancesController {
  constructor(
    private readonly balanceService: BalanceService,
    //@Inject('BALANCE_SERVICE') private readonly client: ClientKafka,
  ) {
  }

  @MessagePattern('user.create.completed')
  async createBalance(@Payload() data: any) {
    console.log('USER CREATED: ', data)
    return this.balanceService.createUserBalance(data);
  }

  @MessagePattern('user.balance')
  async getUserBalance(@Payload() data: any) {
    console.log('GET USER BALANCE: ', data)
    return {
      requestID: data.requestId,
      data:{
        userID: data.request.userID,
        balance: await this.balanceService.getUserBalance(data.request.userID)
      }
    }
  }
}
