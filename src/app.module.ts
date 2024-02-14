import { Module } from "@nestjs/common";
import CommonModule from "./common/common.module";
import { ConfigModule } from "@nestjs/config";
import JoiValidation from "./common/config/env.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: JoiValidation,
    }),
    CommonModule,
  ],
})
export default class AppModule {}
