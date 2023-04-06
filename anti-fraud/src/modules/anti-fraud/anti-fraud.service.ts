import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { TransactionDto, TransactionStatuses } from './dtos/external-dto';
import { AppConfigService } from '../@config/app-config.service';
import { ClientKafka } from '@nestjs/microservices';
import { MAIN_SERVICE_NAME } from 'src/app.constants';
import { Events } from './types/events';

@Injectable()
export class AntiFraudService {
    constructor(private readonly appConfigService: AppConfigService,
        @Inject(MAIN_SERVICE_NAME) private readonly mainClient: ClientKafka) { }

    validateTransaction(transaction: TransactionDto) {
        const status = transaction.value > this.appConfigService.getConfig.ANTI_FRAUD_THRESHOLD ?
            TransactionStatuses.REJECTED :
            TransactionStatuses.COMPLETED;

        const event = status === TransactionStatuses.REJECTED ? Events.ON_TRANSACTION_REJECT : Events.ON_TRANSACTION_COMPLETE;

        this.mainClient.emit(event, JSON.stringify({ _id: transaction._id, transactionStatus: status }));
    }
}