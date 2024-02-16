import { Module } from "@nestjs/common";
import OperationsService from "./operations.service";
import OperationsController from "./operations.controller";

@Module({
  controllers: [OperationsController],
  providers: [OperationsService],
})
export default class OperationsModule {}
