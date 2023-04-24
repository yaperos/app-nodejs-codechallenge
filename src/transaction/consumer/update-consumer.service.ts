import { Injectable } from "@nestjs/common";
import { ConsumerService } from "@core/notificator";
import { TransactionRepository } from "../repository/transaction.repository";
import { Utils } from "../../util/utils";



@Injectable()
export class UpdateConsumerService {
    constructor(private readonly consumerService: ConsumerService,
                private repository: TransactionRepository,
                private util: Utils) { }

    async onModuleInit() {
        await this.consumerService.consumeUpdate(
            { topics: ['update-data'], fromBeginning: false },
            {
                eachMessage: async ({ topic, partition, message }) => {
                    const data = JSON.parse(message.value.toString())['data']
                    this.repository.updateById(this.util.builderCreateTransaction(data))
                }
            });
    }

}