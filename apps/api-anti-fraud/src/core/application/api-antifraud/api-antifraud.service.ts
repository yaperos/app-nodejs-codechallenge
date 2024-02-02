import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionStatuses } from '@app/common/domain/model/transaction.model';
import config from '../../../../../../config';
import { ConfigType } from '@nestjs/config';
import { KafkaClientService } from '@app/kafka-client'
import { KafkaTransaction } from '@app/common/domain/model/kafka.model';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class ApiAntifraudService {
    private readonly logger = new Logger(ApiAntifraudService.name)
    private validatedTransactions: string;
    constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>,
        private kafkaService: KafkaClientService
    ) {
        this.validatedTransactions = this.configService.KAFKA_VALID_TOPIC_NAME;
    }

    async processTransaction(message: any): Promise<void> {
        const ReceivedTransaction: Partial<KafkaTransaction> = message;
        const validation = await this.validateTransaction(ReceivedTransaction.value)
        if(validation){
            ReceivedTransaction.transactionStatus = TransactionStatuses.APPROVED;
        }else{
            ReceivedTransaction.transactionStatus = TransactionStatuses.REJECTED;
        }
        this.sendResponseTransaction(ReceivedTransaction)

    }

    async validateTransaction(value: number): Promise<boolean> {
        if (value <= 1000) return true
        return false
    }
    
    async sendResponseTransaction(transaction: Partial<KafkaTransaction>): Promise<void> {
        this.logger.log(`sendResponseTransaction from ${transaction._id} with status ${transaction.transactionStatus}`);
        await this.kafkaService.sendMessage(this.validatedTransactions, transaction._id, transaction)
    }
}
