import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { NewPaymentnDto } from "src/application/dto/newPaymentDto.dto";

@Injectable()
export class FraudAssessmentUseCase {
    constructor(
        @Inject('KAFKA_SERVICE')
        private readonly kafkaClient: ClientKafka,
    ) { }

    async execute(newPaymentDto: NewPaymentnDto) {
        newPaymentDto.status = this.validateAmount(newPaymentDto.amount);

        this.kafkaClient.emit('fraud_payment_status', newPaymentDto);
        return { message: `Transaction ${newPaymentDto.id} status: ${newPaymentDto.status}` };
    }

    validateAmount(amount: number): 'rejected' | 'approved' {
        if (amount > 1000) {
            return 'rejected';
        }
        if (amount > 0 && amount <= 1000) {
            return 'approved';
        }
        return 'rejected';
    }
}