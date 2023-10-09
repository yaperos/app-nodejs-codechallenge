import "reflect-metadata";
import bodyParser from "body-parser";
import express, { Application } from "express";
import KafkaAdapter from "./adapters/infrastructure/kafka/kafka.adapter";
import { NotificationTopic } from "./helpers/domain/enums/notification-topic.enum";
import { AntiFraudUsecase } from "./modules/anti-fraud/application/anti-fraud.usecase";
import { ITransactionInfo } from "./modules/transaction/domain/interfaces/transaction-info.interface";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

export class AntiFraudApp {
    private app: Application;

    constructor() {
        this.app = express();
        this.app.set("port", process.env.ANTIFRAUD_APP_PORT);
        this.app.use(bodyParser.json());
    }

    public getInstance(): Application {
        return this.app;
    }

    public async run() {
        try {
            this.subscribeToKafka();
            this.app.listen(this.app.get("port"), () => {
                console.log(
                    `[ANTI-FRAUD-APP] - Application is running on port ${this.app.get("port")}`
                );
            });
        } catch (error) {
            console.error("[ANTI-FRAUD-APP] Error: ", error);
        }
    }

    private subscribeToKafka() {
        const kafkaAdapter = new KafkaAdapter(process.env.ANTIFRAUD_APP_KAFKA_GROUP ?? "test-group-02");
        
        kafkaAdapter.consume(
            [NotificationTopic.WHEN_IT_IS_CREATED_AN_TRANSACTION],
            (topic: string, value: any) => {
                console.log("[ANTI-FRAUD-APP] [KAFKA] - Mensaje created", value);
                const transactionInfo = JSON.parse(value) as ITransactionInfo;
                const antiFraudUsecase = AntiFraudUsecase.getInstance();
                antiFraudUsecase.validate(transactionInfo);
            });
    }
}