import { TransactionCreationMapper } from "../application/mappers/transaction-creation.mapper";
import { TransactionInfoMapper } from "../application/mappers/transaction-info.mapper";
import { TransactionUsecase } from "../application/transaction.usecase";
import { INotificationRepository } from "../domain/interfaces/repositories/notification.repository.interface";
import { ITransactionRepository } from "../domain/interfaces/repositories/transaction.repository.interface";
import { ITransferTypeRepository } from "../domain/interfaces/repositories/transfer-type.repository.interface";
import { KafkaRepository } from "./repositories/kafka.repository";
import { TransactionRepository } from "./repositories/transaction.repository";
import { TransferTypeRepository } from "./repositories/transfer-type.repository";
import { TransactionController } from "./transaction.controller";

/**
 * Instances of repositories
 */
const transactionRepository: ITransactionRepository = new TransactionRepository();
const transferTypeRepository: ITransferTypeRepository = new TransferTypeRepository();
const kafkaRepository: INotificationRepository = new KafkaRepository();

/**
 * Instances of use cases
 */
const transactionUsecase = new TransactionUsecase(
    transactionRepository,
    transferTypeRepository,
    kafkaRepository,
    new TransactionCreationMapper(),
    new TransactionInfoMapper(),
);

/**
 * Instances of controllers
 */
export const transactionController = new TransactionController(transactionUsecase);