import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "src/kafka/consumer/consumer.service";
import { Error } from "src/util/Error";
import { ValidationResultDto } from "../dto/ValidationResultDto";
import { TransactionStatuses } from "../helper/TransactionStatuses";
import { TransactionsService } from "../transactions.service";

@Injectable()
export class TransactionRejectedConsumer implements OnModuleInit {
    private logger = new Logger(TransactionRejectedConsumer.name);

    constructor(
        private readonly consumer: ConsumerService,
        private readonly transactionsService: TransactionsService,
    ) {}

    async onModuleInit() {
        this.consumer.consume(
            "transaction.rejected.consumer",
            { topics: ["transaction.rejected"] },
            {
                eachMessage: async ({ topic, partition, message }) => {
                    const result = JSON.parse(message.value.toString()) as ValidationResultDto;
                    this.logger.log(
                        `Transaction with ID ${result.transactionExternalId} was rejected`,
                    );
                    this.transactionsService
                        .updateTransactionStatus(
                            result.transactionExternalId,
                            TransactionStatuses.REJECTED,
                        )
                        .then((result) => {
                            this.logger.log(
                                `Transaction with ID ${result.transactionExternalId} succesfully updated to status: ${result.transactionStatus.name}`,
                            );
                        })
                        .catch((err) => {
                            this.logger.error(new Error("Error updating transaction status", err));
                        });
                },
            },
        );
    }
}
