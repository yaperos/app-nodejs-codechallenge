import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { getEnvironmentVars } from './app/Enviroment';
import { CustomKafkaClientModule } from './app/kafka';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getEnvironmentVars],
    }),
    CustomKafkaClientModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
