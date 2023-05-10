import { TransactionUpdate } from "../../application/transaction.update";
import { PostgreSQLRepository } from "../sequelize";
import { KafkaInstance } from "./kafka";

const messageReadFromTopic = async (message: any) => {
    const repository = new PostgreSQLRepository()
    const transactionUpdate = new TransactionUpdate(repository)
    const payload = JSON.parse(message)
    await transactionUpdate.run(payload.id, payload.stateId)
}

export const consumerRun = async () => {
    const kafka = KafkaInstance.getInstance();
    await kafka.consumerMessage(messageReadFromTopic)
} 