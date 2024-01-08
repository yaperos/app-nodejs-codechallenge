import kafka from '../config/kafka.config';
import {KafkaMessage} from "../messages/KafkaMessage";
import {TransactionService} from "../../services/transaction.service";
import {AppDataSource} from "../../database/datasource";
import {logger} from "../../../domain/bootstrap/logger";

const consumer = kafka.consumer({groupId: 'transactions-approved-group'});

AppDataSource.initialize()
    .then(() => {
        logger.log("Data Source has been initialized!")
    })
    .catch((err) => {
        logger.error(err)
    })

const topic = 'transaction-approved'

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({topic, fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            // @ts-ignore
            const data: KafkaMessage = JSON.parse(message.value.toString());

            const transactionService = new TransactionService();
            await transactionService.approveTransaction(data.id);
        },
    });
};

runConsumer().then(r => {});
