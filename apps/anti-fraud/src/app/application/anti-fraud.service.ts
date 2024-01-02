import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TransactionStatusEnum, MICROSERVICES_CONSTANTS } from '@yape-transactions/shared';
import { AntiFraudCommand } from '../domain/anti-fraud.command';
import { NOTIFY_STATUS_CHANGED_PORT_TOKEN, NotifyStatusChangedPort } from '../domain/notify-status-changed.port';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AntiFraudService implements OnModuleInit {
  private logger = new Logger(AntiFraudService.name);

  private EVENT_BY_STATUS = {
    [TransactionStatusEnum.APPROVED]: MICROSERVICES_CONSTANTS.EVENTS.TRANSACTION_APPROVED,
    [TransactionStatusEnum.REJECTED]: MICROSERVICES_CONSTANTS.EVENTS.TRANSACTION_REJECTED
  };

  private AMOUNT_APPROVED_TX: number;

  constructor(
    private readonly configSrv: ConfigService,
    @Inject(NOTIFY_STATUS_CHANGED_PORT_TOKEN) private readonly notifyStatusChangedPort: NotifyStatusChangedPort) {

  }
  onModuleInit() {
    this.AMOUNT_APPROVED_TX = this.configSrv.get<number>('amountApprovedTX');
  }

  processCreatedTrasaction(command: AntiFraudCommand) {
    const transactionInfo = command.transaction;
    const transactionStatus = this.obtainTransferStatus(transactionInfo);
    this.logger.log(`estado final de la transaccion id:${transactionInfo.transactionId}, estado: ${transactionStatus}`)
    const event = this.EVENT_BY_STATUS[transactionStatus];

    if (!event) {
      this.logger.error(`NO se ha definido un evento para el estado: ${transactionStatus}`);
      return;
    }

    this.notifyStatusChangedPort.notifyStatusChanged(event, {
      transactionId: transactionInfo.transactionId
    });

  }

  obtainTransferStatus(transferInfo: { value: number }): TransactionStatusEnum {
    return transferInfo.value > this.AMOUNT_APPROVED_TX ? TransactionStatusEnum.REJECTED : TransactionStatusEnum.APPROVED
  };

}
