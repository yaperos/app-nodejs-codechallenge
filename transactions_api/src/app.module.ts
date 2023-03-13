import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { Config } from "./config/config.module";
import { TypeOrmConfigService } from "./config/typeorm.config";
import { KafkaModule } from "./kafka/kafka.module";
import { TransactionsModule } from "./transactions/transactions.module";

@Module({
    imports: [
        Config,
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        TransactionsModule,
    ],
    controllers: [AppController],
    providers: [Config],
})
export class AppModule {}
