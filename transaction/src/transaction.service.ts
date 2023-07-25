import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { KafkaService } from './kafka.service';
import { KAFKA_MESSAGES } from './support/domain.constant';

@Injectable()
export class TransactionService {
    constructor(
        private prisma: PrismaService,
        // private kafkaService: KafkaService
    ) { }

    async getAll() {
        return this.prisma.transaction.findMany();
    }

    async getById(transactionExternalId: string) {
        return this.prisma.transaction.findUnique({ where: { transactionExternalId } });
    }

    async create(data: CreateTransactionDto) {
        const result = await this.prisma.transaction.create({ data });
        // const kafkaTopic = KAFKA_MESSAGES.CREATED;
        // const kafkaMessage = this.kafkaService.bodyMessageTransaction(result);
        // await this.kafkaService.sendMessageToKafka(kafkaTopic, kafkaMessage);
        return result;
    }

    async update(transactionExternalId: string, data: UpdateTransactionDto) {
        const result = await this.prisma.transaction.update({ where: { transactionExternalId }, data });
        // const kafkaTopic = KAFKA_MESSAGES.UPDATED;
        // const kafkaMessage = this.kafkaService.bodyMessageTransaction(result);
        // await this.kafkaService.sendMessageToKafka(kafkaTopic, kafkaMessage);
        return result;
    }

    async delete(transactionExternalId: string) {
        const result = await this.prisma.transaction.delete({ where: { transactionExternalId } });
        // const kafkaTopic = KAFKA_MESSAGES.DELETED;
        // const kafkaMessage = this.kafkaService.bodyMessageTransaction(result);
        // await this.kafkaService.sendMessageToKafka(kafkaTopic, kafkaMessage);
        return result;
    }
}
