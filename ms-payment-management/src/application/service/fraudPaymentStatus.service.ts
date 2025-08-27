import { PaymentDto } from "src/application/dto/paymentDto.dto";

export interface FraudServiceStatusInterface {
    handleFraudStatus(message: PaymentDto): void;
}
