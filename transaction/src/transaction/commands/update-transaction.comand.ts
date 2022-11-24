import { AntiFraudResponseDto } from "../dto/anti-fraud-response.dto";

export class UpdateTransactionComand{

  transaction: AntiFraudResponseDto;

  constructor(transaction: AntiFraudResponseDto) {
    this.transaction = transaction;
  }

}