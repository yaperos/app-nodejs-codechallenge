import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePaymentDto } from '../../presentation/operation/http/v1/dto/request/createPaymentDto.dto';
import { UpdatePaymentUseCase } from 'src/application/usecase/operation/updatePayment.usecase';
import { FraudServiceStatusInterface } from 'src/application/service/fraudPaymentStatus.service';

@Controller()
export class FraudPaymentStatusConsumer implements FraudServiceStatusInterface {

    constructor(
        private readonly updatePaymentUseCase: UpdatePaymentUseCase
    ) { }

    @MessagePattern('fraud_payment_status')
    async handleFraudStatus(@Payload() message: CreatePaymentDto) {
        this.updatePaymentUseCase.execute(message);
    }
}