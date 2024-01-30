import { AppService } from "src/app.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class ConsumerService {
    //constructor(private readonly kafkaService: KafkaService) { }

    async onModuleInit() {
        /*await this.kafkaService.consume(
            { topics: [AppService.kafka_topic_status] },
            {
                eachMessage: async ({ topic, partition, message }) => {
                    const { transactionId, status } = JSON.parse(message.value.toString())
                    console.log(transactionId, status)
                    //const application = this.moduleRef.get(TransactionApplication)
                    //await application.update(transactionId, status)
                }

            }
        )*/
    }
}