import { KafkaPublisherSubscriberService } from "../services/kafka/publisher-subscriber-service";
import {
  PublisherSubscriberService,
  TransactionService,
} from "../services/ports";
import { YapeTransactionService } from "../services/yape/transaction-service";
import { consumer, producer } from "./kafka";
import { transactionRepository } from "./repositories";

const transactionService: TransactionService = new YapeTransactionService(
  transactionRepository
);

const publisherSubscriberService: PublisherSubscriberService =
  new KafkaPublisherSubscriberService(producer, consumer);

export { transactionService, publisherSubscriberService };
