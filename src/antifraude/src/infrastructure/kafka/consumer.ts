import { TransactionValidate } from "../../application";
import { KafkaInstance } from "./kafka";



const messageReadFromTopic = async (message: any) => {
    const kafka = KafkaInstance.getInstance();
    const transactionValidate = new TransactionValidate(kafka)
    const payload = JSON.parse(message)
    await transactionValidate.run(payload)
}

export const consumerRun = async () => {
    const kafka = KafkaInstance.getInstance();
    await kafka.consumerMessage(messageReadFromTopic)
} 