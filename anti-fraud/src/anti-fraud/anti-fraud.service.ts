import { Inject, Injectable } from "@nestjs/common";
import { PendingValidAntiFraudDto } from './dto/pending-valid-anti-fraud.dto';
import { AntiFraudResponseDto } from './dto/anti-fraud-response.dto';
import { TransactionStatusEnum } from './dto/TransactionStatus.enum';
import { TransactionClient } from "./transaction-event/transaction.client";

@Injectable()
export class AntiFraudService {

  constructor(
    private readonly _transactionClient:TransactionClient
  ) {
  }

  validAntiFraud(createAntiFraudDto: PendingValidAntiFraudDto) {
    if (createAntiFraudDto == null) return;
    const antifraudResponse = new AntiFraudResponseDto(
      createAntiFraudDto.transactionExternalId,
      createAntiFraudDto.value,
    );
    if (antifraudResponse.value > 1000 || antifraudResponse.value <= 0)
      antifraudResponse.status = TransactionStatusEnum.REJECTED;
    else
      antifraudResponse.status = TransactionStatusEnum.APPROVED;
    console.log(antifraudResponse);
    return JSON.stringify(antifraudResponse);
  }
}
