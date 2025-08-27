import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { FraudAssessmentUseCase } from "src/application/usecase/fraud/FraudAssessment.usecase";
import { NewPaymentnDto } from "./dto/newPaymentDto.dto";
import { PaymentServiceInterface } from "src/application/service/payment.service";

@Controller()
export class PaymentConsumer implements PaymentServiceInterface {
    constructor(
        private readonly fraudAssessmentUseCase: FraudAssessmentUseCase
    ) { }

    @MessagePattern('new_payment')
    async handlerFraudAssessment(@Payload() newPaymenteDto: NewPaymentnDto) {
        console.log({newPaymenteDto})
        this.fraudAssessmentUseCase.execute(newPaymenteDto);
    }
}
