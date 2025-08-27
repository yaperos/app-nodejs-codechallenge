import { NewPaymentnDto } from "../dto/newPaymentDto.dto";

export interface PaymentServiceInterface {
    handlerFraudAssessment(newPaymenteDto: NewPaymentnDto): void;
}
