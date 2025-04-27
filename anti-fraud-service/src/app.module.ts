import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AntiFraudModule } from "./anti-fraud/anti-fraud.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AntiFraudModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
