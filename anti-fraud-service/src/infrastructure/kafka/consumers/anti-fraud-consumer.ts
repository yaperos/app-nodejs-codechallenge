import {Transaction} from "../../../domain/entitites/Transaction";
import kafka from "../config/kafka.config";
import {AntiFraudUseCase} from "../../../application/use-cases/anti-fraud.usecase";
import {KafkaService} from "../services/kafka.service";

const consumer = kafka.consumer({groupId: 'mi-grupo'});
const topic = 'validate-transaction'
const antiFraudService = new AntiFraudUseCase()
const kafkaService = new KafkaService()

export const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({topic, fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const data: Transaction = JSON.parse(message.value.toString());

            if (antiFraudService.validateTransaction(data)) {
                kafkaService.sendApproveTransaction(data.id, data.value)
            } else {
                kafkaService.sendRejectTransaction(data.id, data.value)
            }
        },
    });
};