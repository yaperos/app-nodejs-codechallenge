"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const app_service_1 = require("./app.service");
const microservices_1 = require("@nestjs/microservices");
const logger = new common_1.Logger('FeatureFlag API');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        cors: { origin: '*' },
    });
    app.connectMicroservice({
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
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
    }));
    const configSwagger = new swagger_1.DocumentBuilder()
        .setTitle('App Challenge Yape')
        .setDescription('API Challenge Yape for transaction validation with kafka..')
        .setVersion('1.0');
    if ('LOCAL' !== app_service_1.AppService.environment) {
        configSwagger.addServer(`/${app_service_1.AppService.stage}/challenge-yape`);
    }
    const document = swagger_1.SwaggerModule.createDocument(app, configSwagger.build(), {
        operationIdFactory: (controlKey, methodKey) => methodKey,
    });
    const documentOptions = {
        swaggerOptions: {
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    };
    swagger_1.SwaggerModule.setup('api', app, document, documentOptions);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    await app.startAllMicroservices();
    await app.listen(app_module_1.AppModule.port, '0.0.0.0', () => {
        logger.log(`🚀 Application is running on port: ${app_module_1.AppModule.port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map