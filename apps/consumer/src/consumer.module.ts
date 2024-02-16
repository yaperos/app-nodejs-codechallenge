import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import JoiValidation from "./common/config/env.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: JoiValidation,
    }),
  ],
})
export default class ConsumerModule {}
