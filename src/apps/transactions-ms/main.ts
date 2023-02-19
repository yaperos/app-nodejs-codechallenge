import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const swaggerconfig = new DocumentBuilder()
        .setTitle('Transaction MS')
        .setDescription('The Transaction API')
        .setVersion('1.0')
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerconfig);
    SwaggerModule.setup('docs', app, swaggerDocument);

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    const PORT = configService.get<number>('PORT');
    await app.listen(PORT);
}
bootstrap();
