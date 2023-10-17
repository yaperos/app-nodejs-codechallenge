import { Controller, Inject, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountStatus } from 'src/accounts/domain/entity/account';
import { UpdateAccount } from 'src/accounts/domain/use-case/update-account';

@Controller()
export class BlockAccountEvent {
  public constructor(
    @Inject('UPDATE_ACCOUNT')
    private readonly updateAccount: UpdateAccount,
  ) {}

  @MessagePattern('block.account')
  public async execute(@Payload('accountExternalId') accountBalanceId: string) {
    Logger.log(
      `Block account event received: ${accountBalanceId}`,
      BlockAccountEvent.name,
    );

    this.updateAccount.execute(accountBalanceId, {
      status: AccountStatus.INACTIVE,
    });
  }
}
