import { Module } from '@nestjs/common';
import { AntifraudModule } from './antifraud/antifraud.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AntifraudModule,
  ],
  controllers: [],
  providers: [],
})
export class AntifraudMsModule {}
