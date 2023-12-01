import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidationModule } from './validation/validation.module';

@Module({
  imports: [ValidationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
