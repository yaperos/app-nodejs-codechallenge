import { Module } from '@nestjs/common';
import { AntiFraudeModule } from './anti-fraude/anti-fraude.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AntiFraudeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
