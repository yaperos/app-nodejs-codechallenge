import { Module } from "@nestjs/common";
import OperationsService from "./operations.service";
import OperationsController from "./operations.controller";
import { ClientsModule } from "@nestjs/microservices";
import kafkaProducerConfig from "../common/config/kafka.producer.config";

@Module({
  imports: [ClientsModule.register(kafkaProducerConfig)],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export default class OperationsModule {}
