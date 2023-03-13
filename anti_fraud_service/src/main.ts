import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Partitioners } from "kafkajs";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get<ConfigService>(ConfigService);

    await app.listen(config.get<number>("port"));
}
bootstrap();
