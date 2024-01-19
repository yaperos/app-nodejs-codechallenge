import logger from "../utils/logger";
import { ITransaction } from "../models/transactionModel";
import transactionRepository from "../repositories/transactionRepository";
import { ETopicsTransaction, ETypeEventTransaction, IPayloadTransactionStatus } from "../@types";
import Producer from "./producer";

export default class Transaction {
    public producer;

    constructor(producer: Producer) {
        this.producer = producer;
    }

    async save(data: ITransaction) {
        const transaction = await transactionRepository.save(data);
        const payload = {
            id: transaction.transactionExternalId,
            value: transaction.value
        }

        await this.producer.call(payload, ETypeEventTransaction.EVENT_NEW_TRANSACTION_FRAUD);
        logger.info(`[EXECUTED] ${ETypeEventTransaction.EVENT_NEW_TRANSACTION_FRAUD}`)
    }

    async update(data: IPayloadTransactionStatus) {
        await transactionRepository.update(data.id, data.status);
    }

    async dispatch(topic: ETopicsTransaction, data: any) {
        switch (topic) {
            case ETopicsTransaction.EVENT_NEW_TRANSACTION:
                await this.save(data)

            case ETopicsTransaction.EVENT_TRANSACTION_APPROVED:
            case ETopicsTransaction.EVENT_TRANSACTION_REJECTED:
                await this.update(data)   
                 
            default:
                break;
        }
    }
}