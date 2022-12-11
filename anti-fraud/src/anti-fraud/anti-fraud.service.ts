import { Inject, Injectable } from "@nestjs/common";
import { VerifyTransactionMessage } from './model/event/verify-transaction-message';
import { UpdateTransactionMessage } from "./model/event/update-transaction-message";
import { AntiFraudMapper } from "./mapper/anti-fraud.mapper";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class AntiFraudService {

  constructor(
    private readonly antiFraudMapper: AntiFraudMapper,
    @Inject('anti-fraud-emitter') private readonly clientKafka: ClientKafka) {
  }

  applyAntiFraudValidation(verifyTransactionMessage: VerifyTransactionMessage) {
    if (verifyTransactionMessage == null) return ;

    let updateTransactionMessage: UpdateTransactionMessage = new UpdateTransactionMessage();
    if (verifyTransactionMessage.amount > 1000) {
      updateTransactionMessage = this.antiFraudMapper.buildUpdateTransactionMessageFromVerifyTransactionMessage(verifyTransactionMessage, 3);
    } else {
      updateTransactionMessage = this.antiFraudMapper.buildUpdateTransactionMessageFromVerifyTransactionMessage(verifyTransactionMessage)
    }

    return this.clientKafka.emit('update-transaction', JSON.stringify(updateTransactionMessage));

  }
} 