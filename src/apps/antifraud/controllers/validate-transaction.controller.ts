import { Controller } from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { ValidateTransactionUseCase } from 'src/contexts/antifraud/validator/application/validate/validate-transaction.usecase';
import { TransactionValidationModel } from 'src/contexts/antifraud/validator/domain/transaction-validation.model';
import { TransactionCreatedDto } from 'src/contexts/antifraud/validator/infraestructure/dtos/transaction-created.dto';
import { MessageBrokerDto } from 'src/contexts/shared/infraestructure/message-broker.dto';

@Controller()
export class ValidateTransactionController {
    constructor(
        private readonly validateTransaction: ValidateTransactionUseCase,
    ) {}

    @MessagePattern('transaction_created')
    getHello(
        @Payload() data: { value: MessageBrokerDto<TransactionCreatedDto> },
    ): Promise<TransactionValidationModel> {
        return this.validateTransaction.validate(data.value.attributes);
    }
}
