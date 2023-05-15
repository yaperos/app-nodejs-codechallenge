import {
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { BalanceService } from '../service/balance.service';

@Controller('balances')
export class BalancesController {
  constructor(
    private readonly balanceService: BalanceService, //@Inject('BALANCE_SERVICE') private readonly client: ClientKafka,
  ) {}

  @MessagePattern('user.create.completed')
  async createBalance(@Payload() data: any) {
    return this.balanceService.createUserBalance(data);
  }

  @MessagePattern('user.balance')
  async getUserBalance(@Payload() data: any) {
    return {
      requestID: data.requestId,
      data: {
        userID: data.request.userID,
        balance: await this.balanceService.getUserBalance(data.request.userID),
      },
    };
  }

  @MessagePattern('balance.verify')
  async verifyUserBalance(@Payload() data: any) {
    return {
      hasEnough: await this.balanceService.updateUserBalance(
        data.accountExternalIdDebit,
        data.transactionAmount,
        data.accountExternalIdCredit,
      ),
    };
  }
}
