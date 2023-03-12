import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get<ConfigService>(ConfigService);

    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            consumer: {
                groupId: config.get("KAFKA_GROUP_ID"),
            },
            client: {
                brokers: [config.get("KAFKA_BROKER")],
                ssl: false,
            },
        },
    } as MicroserviceOptions);

    app.startAllMicroservices();

    await app.listen(3000);
}
bootstrap();
