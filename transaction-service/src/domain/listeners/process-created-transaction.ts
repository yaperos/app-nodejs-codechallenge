import { logger } from "../bootstrap/logger";
import { Transaction } from "../entities/transaction";
import { PublisherSubscriberService } from "../services/ports";
import { Listener } from "./ports";

interface DTO {
  transactionId: string;
  amount: number;
}

export class ProcessCreatedTransaction implements Listener {
  constructor(private publisherSubscriberService: PublisherSubscriberService) {}

  async handle(event: { transaction: Transaction }) {
    logger.log(
      `Process created transaction started for transaction id = ${event.transaction.id.value}`,
    );
    try {
      const dto: DTO = {
        transactionId: event.transaction.id.value,
        amount: event.transaction.value,
      };

      await this.publisherSubscriberService.emit(JSON.stringify(dto));
    } catch (error) {
      logger.error(error);
    }
  }
}
