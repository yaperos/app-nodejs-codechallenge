"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const retrieve_module_1 = require("./retrieve-transaction/retrieve.module");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.create(retrieve_module_1.AppModule);
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
        options: {
            subscribe: {
                fromBeginning: true,
            },
            client: {
                clientId: 'transactions-api',
                brokers: ['kafka:9092'],
            },
            consumer: {
                groupId: 'transactions-validate-consumer',
            },
        },
    });
    app.startAllMicroservices();
    await app.listen(3003);
}
bootstrap();
//# sourceMappingURL=main.js.map