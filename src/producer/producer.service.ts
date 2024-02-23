import { Injectable } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { PrismaModule } from "src/prisma/prisma.module";
import {Transaccion} from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()

export class ProducerService {
    constructor( private prisma: PrismaService ) {}
    

  async sendTransaction(transaction: Transaccion) {
        const kafka = new Kafka({
        clientId: 'fraud-check-service',
        brokers: ['172.17.96.79:9092'], 
        });
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
        topic: 'transactions',
        messages: [
            { value: JSON.stringify(transaction) },
        ],
        });
        await producer.disconnect();
    }

    async saveTransaction(transaction: Transaccion) {
        return this.prisma.transaccion.create({
            data: transaction,
        });
    }

   

}
