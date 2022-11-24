import { AntiFraudResponseDto } from "../dto/anti-fraud-response.dto";

export class UpdateStatusTransactionEvent{

  transaction : AntiFraudResponseDto;

  constructor(transaction: AntiFraudResponseDto) {
    this.transaction = transaction;
  }
}