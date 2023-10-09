import "reflect-metadata";
import bodyParser from "body-parser";
import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { TransactionsDataSource } from "./adapters/infrastructure/db";
import KafkaAdapter from "./adapters/infrastructure/kafka/kafka.adapter";
import { NotificationTopic } from "./helpers/domain/enums/notification-topic.enum";
import { transactionRouter } from "./modules/transaction/infrastructure/rest-api/transaction.router";
import { graphQLSchema } from "./modules/transaction/infrastructure/graphql/schemas";
import { config as dotEnvConfig } from "dotenv";
import { errorHandler } from "./helpers/infrastructure/middlewares/error-handler";
import { ITransactionInfo } from "./modules/transaction/domain/interfaces/transaction-info.interface";
import { transactionUsecase } from "./modules/transaction/infrastructure/dependencies";
dotEnvConfig();

export class TransactionApp {
    private app: Application;

    constructor() {
        this.app = express();
        this.app.set("port", process.env.TRANSANCTION_APP_PORT);
        this.app.use(bodyParser.json());
        this.registerEndpoints();
        this.app.use(errorHandler);
    }

    public getInstance(): Application {
        return this.app;
    }

    private registerEndpoints() {
        /** Routers */
        this.app.use("/transaction", transactionRouter);
        this.app.use("/graphql", graphqlHTTP({
            graphiql: true,
            schema: graphQLSchema
        }));
    }

    public async run() {
        try {
            await this.connectDatabase();
            this.subscribeToKafka();
            this.app.listen(this.app.get("port"), () => {
                console.log(
                    `[APP] - Application is running on port ${this.app.get("port")}`
                );
            });
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    private async connectDatabase() {
        console.log("Connecting database...");
        await TransactionsDataSource.initialize();
        console.log("Database has been connected!");       
    }

    private subscribeToKafka() {
        const kafkaAdapter = new KafkaAdapter(process.env.TRANSANCTION_APP_KAFKA_GROUP ?? "test-group-01");
        
        kafkaAdapter.consume(
            [NotificationTopic.WHEN_IT_IS_APPROVED_AN_TRANSACTION, NotificationTopic.WHEN_IT_IS_REJECTED_AN_TRANSACTION],
            (topic: string, value: any) => {
                console.log("[APP] [KAFKA]", topic);
                const transactionInfo = JSON.parse(value) as ITransactionInfo;
                transactionUsecase.updateTransaction(topic as NotificationTopic, transactionInfo);
            });
    }
}