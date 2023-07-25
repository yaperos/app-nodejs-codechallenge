import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [], // Aquí importas otros módulos necesarios para tu aplicación
  controllers: [AppController], // Aquí declaras los controladores que deseas utilizar
  providers: [AppService], // Aquí declaras los servicios que deseas utilizar
})

export class AppModule { }
