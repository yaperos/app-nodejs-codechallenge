import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import OperationsModule from "./operations/operations.module";
import JoiValidation from "./common/config/env.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: JoiValidation,
    }),
    OperationsModule,
  ],
})
export default class ConsumerModule {}
