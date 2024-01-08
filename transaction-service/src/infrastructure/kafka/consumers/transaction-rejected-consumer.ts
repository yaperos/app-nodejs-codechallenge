import kafka from '../config/kafka.config';
import {KafkaMessage} from "../messages/KafkaMessage";
import {TransactionService} from "../../../application/services/transaction.service";
import {AppDataSource} from "../../database/datasource";
import {logger} from "../../../domain/bootstrap/logger";

const consumer = kafka.consumer({groupId: 'transactions-rejected-group'});

AppDataSource.initialize()
    .then(() => {
        logger.log("Data Source has been initialized!")
    })
    .catch((err) => {
        logger.error(err)
    })

const topic = 'transaction-rejected'

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({topic, fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            // @ts-ignore
            const data: KafkaMessage = JSON.parse(message.value.toString());

            const transactionService = new TransactionService();
            await transactionService.rejectTransaction(data.id);
        },
    });
};

runConsumer().then(r => {});
