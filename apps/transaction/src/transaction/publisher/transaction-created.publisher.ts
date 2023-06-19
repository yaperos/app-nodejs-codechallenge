import { Inject, OnModuleInit, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedDto } from '../dto/response/transaction-created.dto';
import { TransactionCreatedEventResponse } from '@nodejs-codechallenge/shared/dto';
import { TransactionEventMapper } from '../mapper/transaction-event.mapper';
import { catchError, lastValueFrom, map } from 'rxjs';
import { GENERIC_ERROR_MESSAGE } from '../../constants/constants';
import { ApplicationProperties } from '../config/application.properties';

@Injectable()
export class TransactionCreatedPublisher implements OnModuleInit {

    private readonly logger = new Logger('TransactionCreatedPublisher');

    constructor(
        @Inject('ANTI_FRAUD_MICROSERVICE') private readonly antiFraudClient: ClientKafka,
        private readonly transactionEventMapper: TransactionEventMapper,
        private readonly applicationProperties: ApplicationProperties
    ) {}

    async publish(transactionCreatedDto: TransactionCreatedDto) : Promise<TransactionCreatedEventResponse>{
        
        try {
            return lastValueFrom(
                this.antiFraudClient
                .send(this.applicationProperties.getTransactionTopicName(),
                    JSON.stringify(this.transactionEventMapper.fromTransactionCreated(transactionCreatedDto)))
                .pipe(
                    catchError(() => {
                        throw new InternalServerErrorException(GENERIC_ERROR_MESSAGE);
                    }),
                    map((res: TransactionCreatedEventResponse) => {
                        return res;
                    }),
                )
            );
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(GENERIC_ERROR_MESSAGE);
        }
    }

    onModuleInit() {
        this.antiFraudClient.subscribeToResponseOf(this.applicationProperties.getTransactionTopicName());
    }
}
