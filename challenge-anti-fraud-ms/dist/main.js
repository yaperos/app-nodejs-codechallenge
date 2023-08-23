"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.KAFKA,
        options: {
            consumer: {
                groupId: process.env.GROUP_ID,
            },
            client: {
                brokers: [process.env.BROKER],
            },
        },
    });
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map