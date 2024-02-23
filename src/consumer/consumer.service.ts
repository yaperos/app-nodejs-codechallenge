import { Injectable, Logger } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { PrismaService } from "../prisma/prisma.service";
import { Transaccion } from "@prisma/client";

@Injectable()
export class ConsumerService {
    readonly status = {
        'pending':1, 
        'approved': 2,
        'rejected' : 3,
    }
    private kafka: Kafka;
    private consumer;
    private prisma: PrismaService;
    private logger = new Logger(ConsumerService.name);

    constructor(prisma: PrismaService) {
        this.kafka = new Kafka({
            clientId: 'consumer',
            brokers: ['172.17.96.79:9092'], 
        });
        this.consumer = this.kafka.consumer({ groupId: 'fraud-check-group' });
        this.prisma = prisma;
    }

    async consume() {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: 'transactions', fromBeginning: true });

        try {
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message,  }) => {
                    try {
                        const mensaje = message.value.toString('utf-8');
                        // this.logger.log(JSON.parse(mensaje));
                        const data_updated = await this.checkTransaction(JSON.parse(mensaje).transaccion_id, JSON.parse(mensaje));
                        const format_data ={
                            "transactionExternalId": data_updated.transactionExternalId,
                            "transactionType": {
                                "name": ""
                            },
                            "transactionStatus": {
                                "name":  data_updated.status === 2 ? "approved" : "rejected"
                            },
                            "value": data_updated.value,
                            "createdAt": data_updated.created_at,
                        }
                        this.logger.log(format_data);
                       
                    } catch (error) {
                        this.logger.error(`Error al procesar el mensaje: ${error.message}`);
                    }
                },
                
            });
        } finally {
            this.logger.log('Consumer desconectado');
        }
    }




    async updateTransaction(transaction: Transaccion) {
        return this.prisma.transaccion.update({
            where: {
                transaccion_id: transaction.transaccion_id,
            },
            data: transaction,
        });
    }


    async checkTransaction( transaccion_id: string, transaction: Transaccion) {
        
        const {value} = await this.prisma.transaccion.findUnique({
            where: {
                transaccion_id: Number(transaccion_id),
            },
        });
       
        console.log(value);
        if (Number(value) > 1000) {
           return  this.updateTransaction({
                ...transaction,
                status: this.status.rejected,
            });
        }else {
            return this.updateTransaction({
                ...transaction,
                status: this.status.approved
            });
        }
    }

    async getTransaccion(transactionExternalId: string) {
        return this.prisma.transaccion.findFirst({
            where: {
                transactionExternalId: transactionExternalId,
            },
        });
    }
}
