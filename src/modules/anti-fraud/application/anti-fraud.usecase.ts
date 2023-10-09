import KafkaAdapter from "../../../adapters/infrastructure/kafka/kafka.adapter";
import { NotificationTopic } from "../../../helpers/domain/enums/notification-topic.enum";
import { ITransactionInfo } from "../../transaction/domain/interfaces/transaction-info.interface";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

export class AntiFraudUsecase {
    private static instance: AntiFraudUsecase;
    private static MAXIMUM_VALUE_ALLOWED_FOR_A_TRANSACTION = 1000;

    constructor() {}

    public static getInstance() {
        if (!AntiFraudUsecase.instance) {
            AntiFraudUsecase.instance = new AntiFraudUsecase();
        }

        return AntiFraudUsecase.instance;
    }

    public async validate(transactionInfo: ITransactionInfo): Promise<void> {
        const topic = transactionInfo.value > AntiFraudUsecase.MAXIMUM_VALUE_ALLOWED_FOR_A_TRANSACTION ? 
            NotificationTopic.WHEN_IT_IS_REJECTED_AN_TRANSACTION : 
            NotificationTopic.WHEN_IT_IS_APPROVED_AN_TRANSACTION;
        const kafkaAdapter = KafkaAdapter.getInstance(process.env.ANTIFRAUD_APP_KAFKA_GROUP ?? "test-group-02");        
        const message = [
            {
                key: 'key2',
                value: JSON.stringify(transactionInfo)
            }
        ]
        kafkaAdapter.produce(topic, message);
    }


}