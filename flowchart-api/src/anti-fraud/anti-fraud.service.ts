import {Inject, Injectable} from '@nestjs/common';
import {Producer} from "kafkajs";

@Injectable()
export class AntiFraudService {
    constructor(
        @Inject('KAFKA_CONSUMER') private kafkaProducer: Producer) {
    }

    async manageTransaction(message: any) {
        const valueTransaction = parseInt(message.value.toString(), 10);
        let status= {id: 2, name: 'approved'};
        if (valueTransaction > 1000) {
            status= {id: 3, name: 'rejected'};
        }
        await this.sendTransaction(message, status);
        return {message, status}
    }

    private async sendTransaction(message: any, status: { name: string; id: number }) {
        const newStatus = status.id;
        await this.kafkaProducer.send({
            topic: 'transactions-' + status.name,
            messages: [
                {
                    key: 'transactions-' + status.name,
                    value: JSON.stringify({
                        ...message,
                        newStatus,
                    }),
                },
            ],
        })
    }
}
