import {AntiFraudService} from "../../services/anti-fraud.service";
import {Transaction} from "../../../domain/entitites/Transaction";
import kafka from "../config/kafka.config";

const consumer = kafka.consumer({groupId: 'mi-grupo'});

const topic = 'validate-transaction'

export const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({topic, fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const data: Transaction = JSON.parse(message.value.toString());
            const antiFraudService = new AntiFraudService()
            antiFraudService.validateTransaction(data);
        },
    });
};