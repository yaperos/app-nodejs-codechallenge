import { Module } from "@nestjs/common";
import TransactionService from "./transaction.service";
import TransactionController from "./transaction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import Transaction from "./entities/transaction.entity";
import { ClientsModule } from "@nestjs/microservices";
import kafkaProducerConfig from "../common/config/kafka.producer.config";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register(kafkaProducerConfig),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export default class TransactionModule {}
