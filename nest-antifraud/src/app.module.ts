import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { getEnvironmentVars } from './app/Enviroment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getEnvironmentVars],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
