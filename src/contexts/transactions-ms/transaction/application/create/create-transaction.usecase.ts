import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientKafka } from '@nestjs/microservices';

import { MessageBrokerDto } from 'src/contexts/shared/infraestructure/message-broker.dto';
import { TransactionModel } from '../../domain/transaction.model';
import { TransactionRepository } from '../../domain/transaction.repository';
import { CreateTransactionDto } from '../../infraestructure/dtos/create-transaction.dto';
import { ValidationTransactionDto } from '../../infraestructure/dtos/validation-transaction.dto';

@Injectable()
export class CreateTransactionUsecase {
    constructor(
        @Inject(TransactionRepository)
        private readonly transactionRepository: TransactionRepository,
        @Inject('TRANSACTION_CREATED_SERVICE')
        private readonly clientKafa: ClientKafka,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    public async createTransaction(
        createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionModel> {
        const transaction =
            TransactionModel.fromCreateDto(createTransactionDto);
        const transactionCreated = await this.transactionRepository.save(
            transaction,
        );

        this.emitTransactionCreatedEvent(transactionCreated);

        return transactionCreated;
    }

    private emitTransactionCreatedEvent(transactionCreated: TransactionModel) {
        const messageBroker: MessageBrokerDto<TransactionModel> = {
            id: `transaction_created.${transactionCreated.id}`,
            type: 'transaction_created',
            occurredOn: new Date(),
            attributes: transactionCreated,
        };
        this.clientKafa
            .send('transaction_created', JSON.stringify(messageBroker))
            .subscribe((response: ValidationTransactionDto) => {
                this.eventEmitter.emit('transaction_validation', response);
            });
    }

    onModuleInit() {
        this.clientKafa.subscribeToResponseOf('transaction_created');
    }

    async onModuleDestroy() {
        await this.clientKafa.close();
    }
}
