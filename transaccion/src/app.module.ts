import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransaccionModule } from './modulos/transaccion/transaccion.module';
import { APP_FILTER } from '@nestjs/core';
import { ValidationPipe } from './utils/validation.pipe';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [TransaccionModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: ValidationPipe,
    }],
})
export class AppModule {}
