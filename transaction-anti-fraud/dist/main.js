"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
        options: {
            subscribe: {
                fromBeginning: true,
            },
            client: {
                clientId: 'transactions-validate',
                brokers: ['kafka:9092'],
            },
            consumer: {
                groupId: 'transactions-validate-consumer-validate',
            },
        },
    });
    app.startAllMicroservices();
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map